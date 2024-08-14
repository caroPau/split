// Registrierung
document
  .getElementById("registerForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault(); // Verhindert das automatische Absenden des Formulars
    const formData = new FormData(this); // Holt die Formulardaten
    console.log(formData + "," + formData.get("username")); // Debugging-Ausgabe
    const data = {
      username: formData.get("username"),
      password: formData.get("password"),
    };

    try {
      const response = await fetch("/api/v1/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data), // Sendet die Formulardaten als JSON
      });

      const result = await response.json();
      if (response.ok) {
        localStorage.setItem("token", result.token); // Speichert das Token im Local Storage
        window.location.href = "http://localhost:3000/groups"; // Weiterleitung bei Erfolg
      } else if (response.status === 403) {
        document.getElementById("usernameExistsMessage").style.display =
          "block"; // Zeigt Fehlermeldung bei bereits bestehendem Benutzernamen an
      }
    } catch (error) {
      alert("An error occurred: " + error.message); // Fehlerbehandlung
    }
  });

// Login
document
  .getElementById("loginForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault(); // Verhindert das automatische Absenden des Formulars
    const formData = new FormData(this); // Holt die Formulardaten
    console.log(formData + "," + formData.get("username")); // Debugging-Ausgabe
    const data = {
      username: formData.get("username"),
      password: formData.get("password"),
    };

    try {
      const response = await fetch("/api/v1/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data), // Sendet die Formulardaten als JSON
      });

      const result = await response.json();
      if (response.ok) {
        //alert("Login successful!"); // Optionales Alert
        window.location.href = "http://localhost:3000/groups"; // Weiterleitung bei Erfolg
        localStorage.setItem("token", result.token); // Speichert das Token im Local Storage
      } else {
        // Optionale Fehlerbehandlung
      }
    } catch (error) {
      alert("An error occurred: " + error.message); // Fehlerbehandlung
    }
  });

// Überprüft die Authentifizierung
function isAuthenticated() {
  const token = localStorage.getItem("token");
  return token !== null && token !== undefined; // Gibt true zurück, wenn Token vorhanden
}

// Überprüft, ob der Benutzer authentifiziert ist und leitet entsprechend weiter
function checkAuthenticatedRoute() {
  if (!isAuthenticated()) {
    if (window.location.pathname !== "/") {
      window.location.href = "http://localhost:3000/"; // Weiterleitung zur Startseite, wenn nicht authentifiziert
    }
  } else {
    if (window.location.pathname === "/") {
      window.location.href = "http://localhost:3000/groups"; // Weiterleitung zur Gruppen-Seite, wenn authentifiziert
    }
  }
}

checkAuthenticatedRoute(); // Führt die Authentifizierungsprüfung durch
