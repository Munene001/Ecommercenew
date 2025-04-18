<script>
  import { goto } from "$app/navigation";
  import { browser } from "$app/environment";
  
  
  
  import Icon from "@iconify/svelte";

  let email = "";
  let password = "";
  let errorMessage = "";
  let showPassword = false;

  const urlParams = browser
    ? new URLSearchParams(window.location.search)
    : null;
  let redirectTo = urlParams?.get("redirect") || "/account";

  function togglePassword() {
    showPassword = !showPassword;
  }

  function fpage() {
    goto("/forgotpassword");
  }

  async function handleLogin() {
    errorMessage = "";
    try {
      const response = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        if (browser) {
          localStorage.setItem("authToken", data.token);
          sessionStorage.removeItem('originalRedirect');
          const target = redirectTo.startsWith("/") ? redirectTo : "/account";
          if (redirectTo) {
            sessionStorage.setItem("originalRedirect", redirectTo);
          }
          await goto(target);
        }
      } else {
        const errorData = await response.json();
        errorMessage = errorData.message || "Login failed";
      }
    } catch (error) {
      errorMessage = "An error occurred. Please try again.";
    }
  }
</script>


<div class="container">
  <div class="template">
    <div class="greener">
      <div class="green">Login To Account</div>
      <div class="green2">Gain access to your Account</div>
    </div>

    <form on:submit|preventDefault={handleLogin}>
      <input type="email" bind:value={email} required placeholder="Email" />
      <div class="password-container">
        <input
          type={showPassword ? "text" : "password"}
          id="password"
          bind:value={password}
          required
          placeholder=" Password"
          class="password-input"
        />
        <span
          class="toggle-icon"
          on:click={togglePassword}
          tabindex="0"
          role="button"
          on:keydown={(e) =>
            e.key === "Enter" || e.key === " " ? toggleNewPassword() : null}
        >
          {#if showPassword}
            <Icon icon="akar-icons:eye-open" />
          {:else}
            <Icon icon="formkit:eyeclosed" />
          {/if}
        </span>
      </div>

      <div class="butter">
        <button type="submit" class="butter1">Login</button>
        <button class="butter2" on:click={fpage}>Forgot Password?</button>
      </div>
      {#if errorMessage}
        <p style="color: red;" class="error">{errorMessage}</p>
      {/if}
      <div class="signup">
        Dont have an account?<a href={`/register?redirect=${encodeURIComponent(redirectTo)}`} aria-label="register">
          Sign Up</a
        >
      </div>
    </form>
    <div class="google">
      <div class="with">Or login with</div>
      <div class="icon">
        <Icon icon="flat-color-icons:google" style="font-size:40px" />Google
      </div>
    </div>
  </div>
</div>




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
  form input {
    margin-top: 20px;
    height: 42px;
    width: 75%;
    align-self: center;
    border-radius: 6px;
    font-size: 16px;
  }
  .password-container {
    align-self: center;
    width: 75%;
    position: relative;
  }
  .password-container input {
    width: 100%;
    align-self: center;
  }
  .toggle-icon {
    position: absolute;
    top: 59%;
    right: 10px;
    transform: translateY(-50%);
    cursor: pointer;
    color: #666;
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
  .error {
    align-self: center;
  }
  .signup {
    align-self: center;
    margin-top: 10px;
    margin-bottom: 18px;
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
  @media (max-width: 768px) {
    .container {
      padding: 30px 0px;
      box-sizing: border-box;
    }
    .template {
      width: 95%;
    }
    .butter {
      gap: 5px;
    }
  }
</style>
