// Überprüft, ob ein Benutzer authentifiziert ist
export function isAuthenticated() {
  const token = localStorage.getItem("token");
  return token !== null && token !== undefined;
}

// Prüft, ob die Route authentifiziert werden muss
export function checkAuthenticatedRoute() {
  console.log("Check: ", window.location.pathname);

  // Weiterleitung, wenn nicht authentifiziert und nicht auf der Startseite
  if (!isAuthenticated()) {
    if (window.location.pathname !== "/") {
      window.location.href = "http://localhost:3000/";
    }
  } else {
    // Weiterleitung, wenn authentifiziert und auf der Startseite
    if (window.location.pathname === "/") {
      window.location.href = "http://localhost:3000/groups";
    }
  }
}
