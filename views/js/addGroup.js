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
        const invalidUsers = validationResult.invalidUsers.join(", ");
        document.getElementById(
          "responseMessage"
        ).innerHTML = `Folgende Benutzer sind ungültig: ${invalidUsers}`;
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
        document.getElementById("responseMessage").innerText =
          "Es ist ein Fehler aufgetreten: " + result.message;
      }
    });
  } else {
    console.log("Groupform not found.");
  }
});
