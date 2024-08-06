// Register
document
  .getElementById("registerForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();
    const formData = new FormData(this);
    console.log(formData + "," + formData.get("username"));
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
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (response.ok) {
        alert("Registration successful!");
        window.location.href = "http://localhost:3000/groups";
      } else {
        alert("Error: " + result.message);
      }
    } catch (error) {
      alert("An error occurred: " + error.message);
    }
  });

//Login
document
  .getElementById("loginForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();
    const formData = new FormData(this);
    console.log(formData + "," + formData.get("username"));
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
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (response.ok) {
        alert("Login successful!");
        window.location.href = "http://localhost:3000/groups";
        // Store the token in local storage
        localStorage.setItem("token", result.token);
      } else {
        alert("Error: " + result.message);
      }
    } catch (error) {
      alert("An error occurred: " + error.message);
    }
  });

  