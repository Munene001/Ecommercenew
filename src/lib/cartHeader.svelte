<!-- CartHeader.svelte -->
<script>
    import Icon from "@iconify/svelte";
    import { onMount } from "svelte";
    import { goto } from "$app/navigation"; // Use SvelteKit's navigation
    import { browser } from "$app/environment"; // Check if running in browser
  
    let cart = [];
    let totalItems = 0;
  
    // Initialize cart from localStorage
    function loadCart() {
      try {
        cart = JSON.parse(localStorage.getItem("cart")) || [];
        totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
      } catch (e) {
        console.error("Error loading cart:", e);
        cart = [];
        totalItems = 0;
      }
    }
  
    // Only run client-side code in the browser
    onMount(() => {
      if (browser) {
        loadCart(); // Initial load
        window.addEventListener("cartUpdated", loadCart); // Listen for updates
        return () => window.removeEventListener("cartUpdated", loadCart); // Cleanup
      }
    });
  
    function navigateToCheckout() {
      if (browser) {
        goto("/cart"); // Use SvelteKit navigation instead of window.location
      }
    }
  </script>
  
  <div class="cart" onclick={navigateToCheckout} role aria-label="cart">
 
     <div ><Icon icon="raphael:cart" style="height:25px; width:25px" /></div>
     <div class="cart-t">Cart</div>
    
      {#if totalItems > 0}
        <button class="cart-count">{totalItems}</button>
      {/if}
    
  </div>
  
  <style>
    .cart {
      display: flex;
      flex-direction: column;
      cursor: pointer;
      position: relative;
    }
    .cart-count {
      position: absolute;
      top: -10px;
      right: -10px;
      background-color: orangered;
      color: white;
      border-radius: 50%;
      font-size: 14px;
      border: none;

    }
    .cart-t{
      font-size: 14px
    }
   
  </style>