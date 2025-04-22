<script>
  import Icon from "@iconify/svelte";
  import { goto } from "$app/navigation";
  import { update } from "lodash-es";
  import { authStore, clearAuth } from "../stores/auth";
  let showModal = false;
  let dialog;

  let isAuthenticated = false;
  let username = null;

  authStore.subscribe(({ isAuthenticated: auth, username : name, isLoading }) => {
    isAuthenticated = auth;
    username = name || null;
    
  });

  function openModal() {
    if (!showModal) {
      showModal = true;
      dialog.showModal();
    }
  }

  function closeModal() {
    showModal = false;
    dialog.close();
  }

  function navigateToAccount() {
    goto("/register");
  }

  function navigateLogin() {
    goto("/login");
  }
  function gotoAccount() {
    goto("/login");
    closeModal();
  }
</script>

<!-- Trigger: Account Icon -->
<div
  on:click={openModal}
  on:focus={openModal}
  style="cursor: pointer; display: inline-block;"
  role
  class="ocon"
>
  <!-- Replace with your actual icon -->
  <div><Icon icon="line-md:account" style="height:25px; width:25px" /></div>
  <div class="ocon-t">
    {#if isAuthenticated && username}
      {username}
    {:else if isAuthenticated}
      Account
    {:else}
      Signup
    {/if}
  </div>
</div>

<!-- Modal -->
<dialog
  bind:this={dialog}
  on:close={closeModal}
  on:click={(e) => {
    if (e.target === dialog) closeModal();
  }}
  role
>
  <div class="modal-content">
    <div class="head">
      <h2>My Account</h2>
      <p class="subtext">Sign in for a more personalized experience</p>
    </div>
    <div class="auth-buttons">
      <button on:click={navigateLogin} class="log">Log In</button>
      <button on:click={navigateToAccount} class="create">Create Account</button
      >
    </div>
    <hr />
    <div class="menu-buttons">
      <div class="menu-t">
        <div class="menu-top">
          <div><Icon icon="fluent-mdl2:activate-orders" /></div>
          <button on:click={() => console.log("Orders")}>Orders</button>
        </div>
        <div class="b">View and Track online or pickup Orders</div>
      </div>
      <div class="menu-t">
        <div class="menu-top">
          <div><Icon icon="simple-line-icons:heart" /></div>
          <button on:click={() => console.log("Favourites")}>Favourites</button>
        </div>
        <div class="b">View saved products</div>
      </div>
      <div class="menu-t">
        <div class="menu-top">
          <div><Icon icon="mdi:account-key-outline" /></div>
          <button on:click={gotoAccount}>Account</button>
        </div>
        <div class="b">Payment, contactinfo, payment, address</div>
      </div>
    </div>
    <hr />
    <!-- Close Button -->
    <button on:focus on:click={closeModal} class="close">Close</button>
  </div>
</dialog>

<style>
  .ocon {
    display: flex;
    flex-direction: column;
    text-align: center;
  }

  .ocon-t {
    font-size: 14px;
  }

  dialog {
    max-width: 32em;
    border-radius: 0.4em;
    border: none;
    padding: 0;
    position: absolute;
    left: 90;
  }

  dialog::backdrop {
    background: rgba(0, 0, 0, 0.3);
  }

  .modal-content {
    padding: 1em;
    display: flex;
    flex-direction: column;
    gap: 7px;
  }
  .head {
    border-bottom: 1px solid gray;
  }

  h2 {
    margin: 0;
  }

  .subtext {
    font-size: 0.9em;
    color: #555;
  }

  .auth-buttons {
    display: flex;
    gap: 30px;
    flex-direction: row;
  }
  .log {
    width: 30%;
    height: 40px;
    background-color: rgb(26, 72, 69);
    color: white;
  }

  .create {
    width: 60%;
    height: 40px;
  }
  .menu-buttons {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .menu-t {
    display: flex;
    flex-direction: column;
    border-bottom: 1px solid gray;
    gap: 7px;
  }

  .menu-t button {
    cursor: pointer;
    border: none;
    background-color: white;
    align-self: start;
    padding: 0px;
  }
  .menu-top {
    display: flex;
    flex-direction: row;
    gap: 8px;
  }
  .menu-top button {
    color: rgb(26, 72, 69);
    font-weight: 600;
  }

  .b {
    font-size: 14px;
    font-weight: 400;
    line-height: 16.94px;
    color: rgb(151, 151, 151);
    margin-bottom: 3px;
  }
  .close {
    height: 40px;
    background-color: rgb(26, 72, 69);
    color: white;
    font-weight: 700;
  }

  button:hover {
    background-color: #ddd;
  }

  dialog[open] {
    animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  @keyframes zoom {
    from {
      transform: scale(0.95);
    }

    to {
      transform: scale(1);
    }
  }

  dialog[open]::backdrop {
    animation: fade 0.2s ease-out;
  }

  @keyframes fade {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }
</style>
