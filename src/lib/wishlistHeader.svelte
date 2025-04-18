<script>
  import { goto } from "$app/navigation";
  import Icon from "@iconify/svelte";

  function navigatetoWishlist() {
    goto("/wishlist");
  }
</script>

<div class="wishlist" onclick={navigatetoWishlist} role>
  <Icon icon="simple-line-icons:heart" style="width: 25px; height: 25px;"/>
  
</div>

<style>
  
</style>
