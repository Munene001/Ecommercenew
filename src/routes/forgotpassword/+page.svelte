<script>
  

  let email = "";
  let message = "";
  let isLoading = false;

  async function handleForgot() {
    isLoading = true;
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        message = "Password reset link sent to your email";
      } else {
        message = data.message || "error sending reset link";
      }
    } catch (error) {
      message = "Email not Registered";
    } finally {
      isLoading = false;
    }
  }
</script>


<div class="container">
  <div class="template">
    <div class="greener">
      <div class="green">Forgot Password</div>
      <div class="green2">Submit email to change your password</div>
    </div>

    <form on:submit|preventDefault={handleForgot}>
      <label class="mail" for="email">Email</label>
      <input type="email" id="email" bind:value={email} required placeholder="Enter Email" />

      

      <button class="butter1" type="submit" disabled={isLoading}>
        {isLoading ? "Sending..." : "Send Reset Link"}
      </button>

      {#if message}
        <p class = message>{message}</p>
      {/if}
    </form>
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
  .butter1 {
    padding: 10px 50px;
    border-radius: 6px;
    font-size: 16px;
    width: 60%;
    align-self: center;
    margin-top: 24px;
    margin-bottom: 20px;
  }
  .message{
    align-self: center;
    color: red;
  }
  .mail{
    align-self: center;
    margin-top: 10px;
    font-size: 16px;
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
