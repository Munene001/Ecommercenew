<script>
  
  import { goto } from "$app/navigation";
  import { browser } from "$app/environment";
 
  import Icon from "@iconify/svelte";

  let username = "";
  let email = "";
  let password = "";
  let passwordConfirmation = ""; // Add this line
  let errorMessage = "";
  let isLoading = false;
  let showPassword = false;
  let showConfirmPassword = false;
  

  const urlParams = browser ? new URLSearchParams(window.location.search) : null;
  let redirectTo = urlParams?.get("redirect") || "/account";
  // Optionally check referrer for redirect (e.g., from /login?redirect=/checkout)
  if (browser && !urlParams?.get("redirect") && document.referrer) {
    try {
      const referrerUrl = new URL(document.referrer);
      if (referrerUrl.pathname === "/login") {
        redirectTo = referrerUrl.searchParams.get("redirect");
      }
    } catch (e) {
      console.error("Error parsing referrer:", e);
    }
  }

  function toggleNewPassword() {
    showPassword = !showPassword;
  }

  function toggleConfirmPassword() {
    showConfirmPassword = !showConfirmPassword;
  }

  async function registerAccount() {
    if (password !== passwordConfirmation) {
      // Client-side validation
      errorMessage = "Passwords don't match";
      return;
    }

    isLoading = true;
    errorMessage = "";

    try {
      const response = await fetch("http://127.0.0.1:8000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
          password_confirmation: passwordConfirmation, // Match Laravel's expected field name
        }),
      });

      if (response.ok) {
        goto(`/login?redirect=${encodeURIComponent(redirectTo)}`);
      } else {
        const errorData = await response.json();
        errorMessage = errorData.message || "Registration failed";
      }
    } catch (error) {
      errorMessage = "An error occurred. Please try again";
      console.error("Registration error:", error);
    } finally {
      isLoading = false;
    }
  }
</script>


<div class="container">
  <div class="template">
    <div class="greener">
      <div class="green">Register Account</div>
      <div class="green2">Make an Account with us</div>
    </div>

    <form on:submit|preventDefault={registerAccount}>
      <input
        type="text"
        bind:value={username}
        required
        placeholder="Username"
      /><br />
      <input type="email" bind:value={email} required placeholder="Email" /><br
      />
      <div class="password-container">
        <input
          type={showPassword ? "text" : "password"}
          id="newPassword"
          bind:value={password}
          required
          placeholder="Password"
          class="password-input"
        />
        <span class="toggle-icon" on:click={toggleNewPassword} role="button" tabindex="0"  on:keydown={e => e.key === 'Enter' || e.key === ' ' ? toggleNewPassword() : null}>
          {#if showPassword}
            <Icon icon="akar-icons:eye-open" />
          {:else}
            <Icon icon="formkit:eyeclosed" />
          {/if}
        </span>
      </div>
      <div class="password-container">
        <input
          type={showConfirmPassword ? "text" : "password"}
          id="confirmPassword"
          bind:value={passwordConfirmation}
          required
          placeholder="Confirm Password"
          class="password-input"
        />
        <span class="toggle-icon" on:click={toggleConfirmPassword} role="button" tabindex="0"  on:keydown={e => e.key === 'Enter' || e.key === ' ' ? toggleNewPassword() : null}>
          {#if showConfirmPassword}
            <Icon icon="akar-icons:eye-open" />
          {:else}
            <Icon icon="formkit:eyeclosed" />
          {/if}
        </span>
      </div>
      
      <div class="butter">
      <button type="submit" disabled={isLoading}  class = "butter1">
        {isLoading ? "Registering..." : "Sign Up"}
      </button>
      <button class="butter2">Login</button>
      </div>

      <p style="color: red;" class="error">{errorMessage}</p>
    </form>
    <div class="google">
      <div class="with">Or Signup with</div>
      <div class="icon">
        <Icon icon="flat-color-icons:google" style="font-size:40px" />Google
      </div>
    </div>
  </div>
</div>

{#if errorMessage}
  <p style="color: red;">{errorMessage}</p>
{/if}


<style>
  .container {
    padding: 50px 0px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .template {
    border: 2px solid black;

    display: flex;
    flex-direction: column;
    width: 374px;
  }
  .greener {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: rgb(26, 72, 69);
    color: white;
    height: 100px;
    justify-content: center;
  }
  .green {
    font-size: 24px;
    font-weight: 700;
    line-height: 28.8px;
    color: rgb(255, 255, 255);
  }
  .green2 {
    font-size: 18px;
    font-weight: 300;
    line-height: 20px;
    color: rgb(255, 255, 255);
  }
  form {
    height: auto;
    display: flex;
    flex-direction: column;
    border-bottom: 1px solid black;
  }
  .password-container{
    align-self: center;
    width: 75%;
    position: relative;
  }
  .toggle-icon {
    position: absolute;
    top: 59%;
    right: 10px;
    transform: translateY(-50%);
    cursor: pointer;
    color: #666;
  }
  .password-container input{
    width: 100%;
   margin-top: 10px;
   align-self: center;
   
  }
  form input {
    margin-top: 10px;
    height: 42px;
    width: 75%;
    align-self: center;
    border-radius: 6px;
    font-size: 16px;
  }
  .butter {
    display: flex;
    flex-direction: row;
    align-self: center;
    margin-top: 20px;
    gap: 10px;
  }
  .butter1 {
    padding: 10px 50px;
    border-radius: 6px;
    font-size: 16px;
  }
  .butter2 {
    border: none;
    background-color: transparent;
  }

  
  .google {
    background-color: rgb(242, 242, 242);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    justify-items: center;
    padding: 10px 0px;
  }
  .icon {
    display: flex;
    flex-direction: row;
    justify-items: center;
    font-size: 14px;
  }
  .with {
    font-size: 14px;
    font-weight: 300;
    line-height: 21px;
    color: rgb(0, 0, 0);
  }
  .error {
    align-self: center;
  }
  @media (max-width: 768px) {
    .container {
      padding: 30px 0px;
      box-sizing: border-box;
    }
    .template {
      width: 95%;
    }
  }
</style>
