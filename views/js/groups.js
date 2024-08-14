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

    const groupList = document.getElementById("group-list");

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
