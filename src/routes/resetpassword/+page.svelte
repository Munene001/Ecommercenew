<script>

  import { page } from "$app/stores";
  import Icon from "@iconify/svelte";

  let newPassword = "";
  let confirmPassword = "";
  let message = "";
  let isLoading = false;
  let showNewPassword = false;
  let showConfirmPassword = false;

  function toggleNewPassword() {
    showNewPassword = !showNewPassword;
  }

  function toggleConfirmPassword() {
    showConfirmPassword = !showConfirmPassword;
  }

  const token = $page.url.searchParams.get("token");
  const email = $page.url.searchParams.get("email");

  async function handleReset() {
    if (newPassword !== confirmPassword) {
      message = "Passwords do not match";
      return;
    }
    isLoading = true;
    try {
      const response = await fetch("http://127.0.0.1:8000/api/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password: newPassword,
          password_confirmation: confirmPassword,
          token,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        message = "Password reset successfully";
        setTimeout(() => (window.location.href = "/login"), 1000);
      } else {
        message = data.message || "Error resetting password";
      }
    } catch (error) {
      message = "Network error occurred";
    } finally {
      isLoading = false;
    }
  }
</script>



<div class="container">
  <!--{#if !token || !email}
  <p>Invalid reset link. Please request a new password reset.</p>
{:else}-->
  <div class="template">
    <div class="greener">
      <div class="green">Reset Account Password</div>
      <div class="green2">Change the password to one you can remember</div>
    </div>
    <form on:submit|preventDefault={handleReset}>
      <input type="hidden" name="email" value={email} />
      <input type="hidden" name="token" value={token} />

      <div class="password-container">
        <input
          type={showNewPassword ? "text" : "password"}
          id="newPassword"
          bind:value={newPassword}
          required
          placeholder="New Password"
          class="password-input"
        />
        <span class="toggle-icon" on:click={toggleNewPassword} role>
          {#if showNewPassword}
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
          bind:value={confirmPassword}
          required
          placeholder="Confirm Password"
          class="password-input"
        />
        <span class="toggle-icon" on:click={toggleConfirmPassword} role>
          {#if showConfirmPassword}
            <Icon icon="akar-icons:eye-open" />
          {:else}
            <Icon icon="formkit:eyeclosed" />
          {/if}
        </span>
      </div>

      <button class="butter1" type="submit" disabled={isLoading}>
        {isLoading ? "Resetting..." : "Reset Password"}
      </button>

      {#if message}
        <p class:error={!message.includes("successfully")}>{message}</p>
      {/if}
    </form>
  </div>
  <!--{/if}-->
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
  
  form input {
    margin-top: 20px;
    height: 42px;
    width: 100%;
    align-self: center;
    border-radius: 6px;
    font-size: 16px;
  }
  .butter1 {
    padding: 10px 50px;
    border-radius: 6px;
    font-size: 16px;
    width: 60%;
    align-self: center;
    margin-top: 14px;
    margin-bottom: 20px;
  }
  p {
    align-self: center;
    color: red;
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
