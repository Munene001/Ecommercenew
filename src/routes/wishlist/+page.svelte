<script>
  import Icon from "@iconify/svelte";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import { authStore } from "../../stores/auth";

  let isAuthenticated = false;
  let isLoading = true;
  let wishlist = [];
  let products = [];
  let message = "";

  authStore.subscribe(({ isAuthenticated: auth }) => {
    isAuthenticated = auth;
  });

  onMount(async () => {
    if (!isAuthenticated) {
      message = "Please log in to view wishlist";
      isLoading = false;
      return;
    }
    try {
      const token = localStorage.getItem("authToken");
      const wishlistResponse = await fetch(
        "http://127.0.0.1:8000/api/wishlist",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!wishlistResponse.ok) {
        throw new Error(`failed to fetch wishlist`);
      }
      const { wishlist: wishlistIds } = await wishlistResponse.json();
      wishlist = wishlistIds;

      if (wishlistIds.length === 0) {
        isLoading = false;
        return;
      }

      const productsResponse = await fetch(
        `http://127.0.0.1:8000/api/products/bulk`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ product_ids: wishlistIds }),
        }
      );
      if (!productsResponse.ok) {
        throw new Error("Failed to fetch products: $productsResponse.status");
      }
      const { products: fetchedProducts } = await productsResponse.json();
      products = fetchedProducts || [];
      products = products.sort(
        (a, b) =>
          wishlistIds.indexOf(a.product_id) - wishlistIds.indexOf(b.product_id)
      );
      if (products.length === 0 && wishlistIds.length > 0) {
        message =
          "No products could be loaded. They may nolonger be available.";
      } else if (products.length < wishlistIds.length) {
        message = `${wishlistIds.length - products.length}  product${wishlistIds.length - products.length > 1 ? "s" : ""} could not be loaded.`;
      }
      if (message) setTimeout(() => (message = ""), 3000);
    } catch (error) {
      message = "Error loading wishlist. Please try again";
    } finally {
      isLoading = false;
    }
  });
  function openProductPage(product_id) {
    return () => goto(`/product/${product_id}`);
  }
  async function removeItem(product_id) {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `http://127.0.0.1:8000/api/wishlist/${product_id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        wishlist = wishlist.filter((id) => id !== product_id);
        products = products.filter(
          (product) => product.product_id !== product_id
        );
        message = "Product removed from wishlist";
        setTimeout(() => (message = ""), 1500);
      } else {
        message = "Failed to remove product from wishlist";
        setTimeout(() => (message = ""), 1500);
      }
    } catch (error) {
      message = "Error removing product from wishlist.";
      setTimeout(() => (message = ""), 1500);
    }
    wishlist = [...wishlist];
  }
</script>

<div class="wishlist-uno">
  <h1>Your Wishlist</h1>
  {#if isLoading}
    <p>Loading wishlist...</p>
  {:else if !isAuthenticated}
    <p>{message}</p>
    <button class="login-btn" on:click={() => goto(`/login?redirect=/wishlist`)}> Log In </button>
  {:else if wishlist.length === 0}
    <p>Your wishlist is empty.</p>
    <button class="continue-shopping" on:click={() => goto("/products")}>
      Continue Shopping
    </button>
  {:else if products.length === 0}
    <p>{message || "No products available in your wishlist."}</p>
    <button class="continue-shopping" on:click={() => goto("/products")}>
      Continue Shopping
    </button>
  {:else}
    <div class="wishlist-items">
      {#each products as product (product.product_id)}
        <div
          class="wishlist-item"
          
        >
          <div class="item-image" on:click={openProductPage(product.product_id)}
          role>
            <img
              src={product.images && product.images.length > 0
                ? product.images[0].imageurl
                : "/fallback-image.jpg"}
              alt={product.productname || "Product"}
              loading="lazy"
            />
          </div>
          <div class="item-details">
            <h2>
              {product.productname || "Unknown Product"}
            </h2>
            <p>
              Price: ${parseFloat(
                product.discountprice || product.price || 0
              ).toFixed(2)}
              {#if product.discountprice}
                <span class="original-price"
                  >${parseFloat(product.price || 0).toFixed(2)}</span
                >
              {/if}
            </p>
            
            <button
              class="remove-btn"
              on:click={() => removeItem(product.product_id)}
              aria-label="Remove item from wishlist"
            >
              <Icon icon="mdi:trash-can-outline" /> Remove
            </button>
          </div>
        </div>
      {/each}
    </div>
  {/if}
  {#if message && products.length > 0}
    <p class="message">{message}</p>
  {/if}
</div>

<style>
  .wishlist-uno {
    
    margin: 0 auto;
    padding: 2rem;
  }

  h1 {
    font-size: 2rem;
    margin-bottom: 1.5rem;
  }

  .wishlist-items {
    display: grid;
    gap: 0.5rem;
  }

  .wishlist-item {
    display: flex;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 1rem;
    align-items: center;
  }

  .item-image {
    width: 100px;
    height: 100px;
    cursor: pointer;
  }

  .item-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 4px;
  }

  .item-details {
    flex: 1;
    margin-left: 1.5rem;
  }

  .item-details h2 {
    font-size: 1.25rem;
    margin: 0 0 0.5rem;
    cursor: pointer;
  }

  .item-details p {
    margin: 0.5rem 0;
  }

  .original-price {
    text-decoration: line-through;
    color: #888;
    margin-left: 0.5rem;
  }

  .remove-btn {
    background: none;
    border: none;
    color: #d32f2f;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 14px;
    padding: 0;
    margin-top: 1rem;
  }

  .remove-btn:hover {
    color: #b71c1c;
  }

  .continue-shopping,
  .login-btn {
    background: #007bff;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 1rem;
  }

  .continue-shopping:hover,
  .login-btn:hover {
    background: #0056b3;
  }

  .message {
    color: #d9363e;
    margin-top: 1rem;
  }
</style>
