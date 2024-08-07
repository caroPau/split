
document
  .getElementById("btn-logout")
  .addEventListener("click", async function (event) {
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

  window
  .addEventListener('load', async() => {
    let token = localStorage.getItem("token");
   
    if(!token){
        console.log("No token found");
        return;
    }
    
    try{
        const response = await fetch('/api/v1/users/myGroups', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if(!response.ok){
            console.log("Error fetching groups.");
            return;
        }

        const result = await response.json();
        console.log("Groups: ", result.data.groups);

        const groupList = document.getElementById("group-list");
        groupList.innerHTML = ' ';

        if(!result.data || result.data.groups.length < 1){
            groupList.innerHTML = "<p>No groups available.</p>";
        }
        else{
            result.data.groups.forEach(group => {
                const groupItem = document.createElement('div');
                groupItem.classList.add('group-item');
                groupItem.innerHTML = `<h2>${group.groupName}</h2>
                                        <button type="button">Details</button>`;
                groupList.appendChild(groupItem);
            });
        }
    }catch(error){
        console.log("An error occurred: ", error.message);
    }

  })
