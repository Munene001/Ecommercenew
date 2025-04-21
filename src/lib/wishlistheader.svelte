<!-- CartHeader.svelte -->
<script>
    import Icon from "@iconify/svelte";
    import { onMount } from "svelte";
    import { goto } from "$app/navigation"; // Use SvelteKit's navigation
    import { browser } from "$app/environment"; // Check if running in browser
  
   
  
    // Initialize cart from localStorage
    
  
    // Only run client-side code in the browser
    
    function navigateToWishlist() {
      if (browser) {
        goto("/wishlist"); // Use SvelteKit navigation instead of window.location
      }
    }
  </script>
  
  <div class="wishlist" onclick={navigateToWishlist} role aria-label="wishlist">
 
     <div ><Icon icon= "simple-line-icons:heart" style="height:25px; width:25px" /></div>
     
    
      
    
  </div>
  
  <style>
    .wishlist {
      display: flex;
      flex-direction: column;
      cursor: pointer;
      position: relative;
    }
  
    
   
  </style>