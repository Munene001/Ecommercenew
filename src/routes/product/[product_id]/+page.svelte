<script>
  import Fullviewproduct from "../../../lib/fullviewproduct.svelte";
  import Recentlyview from "../../../lib/recentlyview.svelte";
  import { onMount } from 'svelte';

  export const showNavigation = false;

  // Single data prop that contains everything
  export let data ;

 
    
    
  

  $: if (data.product) {
    console.log("Product received:", data.product);
  }
</script>

{#if data.product}
  <Fullviewproduct 
    product={data.product} 
  
  />
{:else if data.product === null}
  <p>Product not found.</p>
{:else}
  <p>Loading product</p>
{/if}