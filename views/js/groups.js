//
//  Event Listener für die Seiten groups.html und addGroup.html
//

//Event Listener für das Formular zum Erstellen einer Gruppe in der addGroup.html
// liest das Formular aus, authentifiziert den User und sendet die Daten zum erstellen an den Server
document.addEventListener("DOMContentLoaded", function () {
  const groupForm = document.getElementById("groupForm");

  if (groupForm) {
    groupForm.addEventListener("submit", async function (event) {
      event.preventDefault();

      const groupName = document.getElementById("groupName").value;
      const groupMembers = document
        .getElementById("groupMembers")
        .value.split(",")
        .map((name) => name.trim());

      let token = localStorage.getItem("token");

      const userValidationResponse = await fetch("/api/v1/groups/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ users: groupMembers }),
      });

      const validationResult = await userValidationResponse.json();

      if (!userValidationResponse.ok || !validationResult.allUsersValid) {
        document.getElementById("responseMessage").innerHTML =
          "Ein oder mehrere Benutzer sind ungültig.";
        return;
      }
      const response = await fetch("/api/v1/groups/newGroup/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ groupName, groupMembers }),
      });

      const result = await response.json();

      if (response.ok) {
        document.getElementById("responseMessage").innerText =
          "Gruppe erfolgreich erstellt!";
      } else {
      }
    });
  } else {
    console.log("Groupform not found.");
  }
});

// Event Listener für den Logout-Button in der groups.html
// Löscht den token aus Local Storage und leitet zurück zur Login-Seite
document.addEventListener("DOMContentLoaded", function () {
  const logoutButton = document.getElementById("btn-logout");
  if (logoutButton) {
    logoutButton.addEventListener("click", async function (event) {
      event.preventDefault();
      try {
        const response = await fetch("/api/v1/users/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          alert("Logged out successfully");
          localStorage.removeItem("token");
          window.location.href = "http://localhost:3000";
        } else {
          alert("Error logging out");
        }
      } catch (error) {
        alert("An error occured: " + error.message);
      }
    });
  } else {
    console.log("Logout button not found.");
  }
});

// Event Listener der beim Laden der Seite groups.html
// den User authentisiert, die Gruppen aus der Datenbank abfragt und anzeigt
window.addEventListener("load", async () => {
  let token = localStorage.getItem("token");

  if (!token) {
    console.log("No token found");
    return;
  }

  try {
    const response = await fetch("/api/v1/users/myGroups", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.log("Error fetching groups.");
      return;
    }
    const result = await response.json();
    console.log("Groups: ", result.data.groups);

    const groupList = document.getElementById("group-list");
    groupList.innerHTML = " ";

    if (!result.data || result.data.groups.length < 1) {
      groupList.innerHTML = "<p>No groups available.</p>";
    } else {
      result.data.groups.forEach((group) => {
        const groupItem = document.createElement("div");
        groupItem.classList.add("group-item");
        groupItem.innerHTML = `<h2>${group.groupName}</h2>
          <a href="/groups/${group._id}">Details</a>`;
        groupList.appendChild(groupItem);
      });
    }
  } catch (error) {
    console.log("An error occurred: ", error.message);
  }
});

// Event Listener für den Zurück-Button in der addGroup.html
document.addEventListener("DOMContentLoaded", function () {
  const returnButton = document.getElementById("btn-back");

  if (returnButton) {
    returnButton.addEventListener("click", async function (event) {
      event.preventDefault();
      window.location.href = "http://localhost:3000/groups.html";
    });
  } else {
    console.log("Return button not found.");
  }
});
