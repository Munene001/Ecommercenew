
<script>
    
    import Fullviewproduct from "../../../lib/fullviewproduct.svelte";
    import Recentlyview from "../../../lib/recentlyview.svelte";
  

    
    

    export let data;
    let product = data.product;

    $: if (product){
      console.log("Product received:", product);
    }
</script>

    
  
  {#if product}
    <Fullviewproduct {product}/>
    
  {:else if product === null}
    <p>Product not found.</p>
    {:else}
    <p>Loading product</p>
  {/if}
  
  



