<script>
    import { goto } from "$app/navigation";
    import { browser } from "$app/environment"; 
    
  
    let token = browser ? localStorage.getItem("authToken") || "" : "";
    let user = null;
    let error = null;
  
    async function fetchUser() {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/user", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (response.ok) {
          user = await response.json();
        } else {
          goto("login");
        }
      } catch (err) {
        error = "An error occurred while fetching user data";
      }
    }
  
    async function handleLogout() {
      try {
        await fetch("http://127.0.0.1:8000/api/logout", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (browser) {
          localStorage.removeItem("authToken");
        }
        goto("/login");
      } catch (err) {
        console.error("Logout failed", err);
      }
    }
  
    if (browser) {
      fetchUser();
    }
  </script>
  
  
  {#if error}
    <p style="color: red;">{error}</p>
  {:else if user}
    <h1>Welcome, {user.username}!</h1>
    <button on:click={handleLogout}>Logout</button>
  {:else}
    <p>Loading...</p>
  {/if}