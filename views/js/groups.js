// Lädt die Gruppen vom Server
async function loadGroups() {
  console.log("hello 1");
  let token = localStorage.getItem("token");

  const response = await fetch("/api/v1/groups", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return await response.json();
}

// Zeigt die geladenen Gruppen auf der Seite an
async function displayGroups() {
  const groups = await loadGroups();

  const groupList = document.getElementById("groupList");
  groupList.innerHTML = " ";

  if (groups.data.groups.length > 0) {
    groups.data.groups.forEach((group) => {
      const groupItem = document.createElement("div");
      groupItem.className = "group-item";
      groupItem.innerHTML = `
        <h2>${group.groupName}</h2>
        <a href="/groups/${group._id}">Details</a>
      `;
      groupList.appendChild(groupItem);
    });
  } else {
    groupList.innerHTML = "<p>No groups found.</p>";
  }
}

displayGroups();

// Event Listener für das Formular zur Erstellung einer Gruppe in addGroup.html
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

      // Überprüft die Benutzer im Formular
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
      // Sendet die Daten zur Erstellung der Gruppe
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
        // Optionale Fehlerbehandlung
      }
    });
  } else {
    console.log("Groupform not found.");
  }
});

// Event Listener für den Button zum Erstellen einer neuen Gruppe
document
  .getElementById("btn_create_group")
  .addEventListener("click", function () {
    window.location.href = "./addGroup.html";
  });

// Event Listener für den Logout-Button
document.getElementById("btn-logout").addEventListener("click", function () {
  window.location.href = "/logout";
});

// Lädt die Gruppen des Benutzers beim Laden der Seite
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

// Event Listener für den Zurück-Button in addGroup.html
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

// Überprüft die Authentifizierung und leitet je nach Status weiter
function isAuthenticated() {
  const token = localStorage.getItem("token");
  return token !== null && token !== undefined;
}

function checkAuthenticatedRoute() {
  if (!isAuthenticated()) {
    if (window.location.pathname !== "/") {
      window.location.href = "http://localhost:3000/";
    }
  } else {
    if (window.location.pathname === "/") {
      window.location.href = "http://localhost:3000/groups";
    }
  }
}

checkAuthenticatedRoute();
if (isAuthenticated()) {
  document.getElementById("group-container").style.display = "block";
}
