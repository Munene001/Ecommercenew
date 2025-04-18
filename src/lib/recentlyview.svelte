<script>
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { invalidate } from "$app/navigation";

  export let currentProduct = null;
  let recentProducts = [];
  let browserId = "";
  let error = null;
  let isLoading = false; // New loading state
  let testPoints = {
    // Test/debug information
    lastTrackResponse: null,
    lastFetchResponse: null,
    lastError: null,
  };

  // Consistent header name
  const BROWSER_ID_HEADER = "X-Browser-ID";

  const getBrowserId = () => {
    if (typeof window === "undefined") return "";
    let id = localStorage.getItem("rv_browser_id");
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("rv_browser_id", id);
      console.log("TEST: Generated new browser ID:", id); // Test point
    }
    return id;
  };

  async function trackAndFetch() {
    browserId = getBrowserId();
    if (!browserId) {
      console.error("TEST: No browser ID available");
      return;
    }

    isLoading = true;
    error = null;
    testPoints.lastError = null;

    try {
      // Track current product view if available
      if (currentProduct?.product_id) {
        console.log("TEST: Tracking product:", currentProduct.product_id); // Test point
        const trackResponse = await fetch(
          "http://127.0.0.1:8000/api/recentlyviewed/track",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              [BROWSER_ID_HEADER]: browserId, // Consistent header
            },
            body: JSON.stringify({
              product_id: currentProduct.product_id,
              browser_id: browserId,
            }),
          }
        );
        testPoints.lastTrackResponse = trackResponse;

        if (!trackResponse.ok) {
          throw new Error(`Tracking failed: ${trackResponse.status}`);
        }
      }

      // Fetch recent views
      console.log("TEST: Fetching recent views for:", browserId); // Test point
      const fetchResponse = await fetch(
        "http://127.0.0.1:8000/api/recentlyviewed/index",
        {
          headers: { [BROWSER_ID_HEADER]: browserId },
          credentials: "include",
        }
      );
      testPoints.lastFetchResponse = fetchResponse;

      if (!fetchResponse.ok) {
        throw new Error(`Fetch failed: ${fetchResponse.status}`);
      }

      const data = await fetchResponse.json();
      console.log("TEST: Received data:", data); // Test point

      // Filter out current product if needed
      recentProducts = currentProduct?.product_id
        ? data.filter((p) => p.product_id !== currentProduct.product_id)
        : data;
    } catch (err) {
      console.error("Recently viewed error:", err);
      error = "Unable to load recently viewed products";
      testPoints.lastError = err;
      recentProducts = [];
    } finally {
      isLoading = false;
    }
  }

  onMount(trackAndFetch);
  const navigateToProduct = async (productId) => {
    if (!productId || productId === currentProduct?.product_id) return;

    try {
      //
      await goto(`/product/${productId}`);

      // Fallback: If no change after 500ms, force reload
      setTimeout(async () => {
        if (window.location.pathname === `/product/${productId}`) {
          await invalidate("product");
          window.location.reload();
        }
      });
    } catch (error) {
      console.error("Navigation failed:", error);
      window.location.href = `/product/${productId}`;
    }
  };
</script>

{#if isLoading}
  <div class="loading-indicator">Loading recently viewed...</div>
{:else if error}
  <p class="error">{error}</p>
{:else if recentProducts.length > 0}
  <div class="recent-products-grid">
    <div class="heading">Recently Viewed</div>
    <div class="nonhead">
      {#each recentProducts as product (product.product_id)}
        <div
          class="product-card"
          on:click={() => navigateToProduct(product.product_id)}
          on:keydown={(e) =>
            e.key === "Enter" && navigateToProduct(product.product_id)}
          tabindex="0"
          role="button"
        >
          <div class="img">
            <img
              src={product.images?.[0]?.imageurl || "/placeholder.jpg"}
              alt={product.productname}
              loading="lazy"
            />
          </div>
          <div class="product-info">
            <div class="name">{product.productname}</div>
            <div>
              <div class=" price">
                {#if product.discountprice}<div class="originalprice">
                    <i
                      ><span>ksh</span
                      >{product.price}</i
                    >
                  </div>
                  <div class="discountedprice">
                    <span></span
                    >{product.discountprice}
                  </div>
                {:else}
                  <div class="finalprice">
                    <span> </span>{product.price}
                  </div>
                {/if}
              </div>
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>
{/if}

<style>
  .loading-indicator {
    padding: 1rem;
    text-align: center;
    color: #666;
  }

  .error {
    color: #d32f2f;
    padding: 1rem;
    text-align: center;
  }

  .recent-products-grid {
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
    padding: 20px 0px;
  }
  .nonhead {
    display: flex;
    flex-direction: column;
    gap: 35px;
  }
  .product-card {
    display: flex;
    flex: row;
    align-items: center;
  }
  .img {
    height: 50px;
    width: 75px;
  }
  .img img {
    height: 70px;
    width: 50px;
    object-fit: scale-down;
    
    
  }
  .product-info {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  .price {
    display: flex;
    flex-direction: row;
    gap: 7px;
    
    font-weight: 400;
    line-height: 16.8px;
    color: rgb(0, 0, 0);
  }
  .name {
    font-size: 14px;
    font-weight: 400;
    line-height: 16.8px;
    color: rgb(0, 0, 0);
  }
  .originalprice {
    text-decoration: line-through;
    color: #666;
    font-size: 12px;
  }
  .discountedprice {
    font-weight: 500;
    font-size: 14px;
  }
  .finalprice {
    font-weight: 500;
    font-size: 14px;
  }
  .heading {
    font-size: 16px;
    
    line-height: 19.2px;
    color: rgb(0, 0, 0);
  }

  /* Your existing styles... */
</style>
