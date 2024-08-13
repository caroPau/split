export function isAuthenticated() {
  const token = localStorage.getItem("token");
  if (token !== null && token !== undefined) {
    return true;
  }
  return false;
}

export function checkAuthenticatedRoute() {
  console.log("Check: ", window.location.pathname);
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
