<script>
  import { onMount, onDestroy } from "svelte";
  import { browser } from "$app/environment";
  import Icon from "@iconify/svelte";
  import { goto } from "$app/navigation";
  import Cartadd from "../../lib/cartadd.svelte";
  
  import {openProductPage} from "../../lib/productutil.js";

  let cart = [];
  let products = [];
  let totalItems = 0;
  let totalPrice = 0;
  let error = null;
  let imessages = [];

  // Load cart from localStorage
  function loadCart() {
    try {
      cart = JSON.parse(localStorage.getItem("cart")) || [];
      totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
      fetchProductDetails();
    } catch (e) {
      console.error("Error loading cart:", e);
      cart = [];
      totalItems = 0;
      error = "Failed to load cart.";
      setTimeout(() => (error = null), 3000);
    }
  }

  // Fetch product details using product_id

  async function fetchProductDetails() {
    try {
      if (cart.length === 0) {
        products = [];
        totalPrice = 0;
        return;
      }

      const productIds = [...new Set(cart.map((item) => item.product_id))];
      const response = await fetch(`http://127.0.0.1:8000/api/products/bulk/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ product_ids: productIds }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch product details");
      }

      const data = await response.json();
      const productMap = new Map();

      // Fix property access here
      data.products.forEach((product) => {
        productMap.set(product.product_id, product);
      });

      products = cart.map((item) => {
        const product = productMap.get(item.product_id);
        if (!product) {
          throw new Error(`Product ${item.product_id} not found`);
        }

        const size = product.productsizes?.find(
          (s) => s.size_id === item.size_id
        ) || { size: "Unknown", stock_quantity: 0 };

        return {
          product_id: product.product_id,
          productname: product.productname,
          price: product.price,
          discountprice: product.discountprice,
          images: product.images || [],
          size: size.size,
          size_id: item.size_id,
          quantity: item.quantity,
          stock_quantity: size.stock_quantity,
        };
      });

      totalPrice = products.reduce(
        (sum, p) => sum + (p.discountprice || p.price || 0) * p.quantity,
        0
      );
      error = null;
    } catch (err) {
      console.error("Error fetching products:", err);
      error = err.message.includes("not found")
        ? "Some products could not be found."
        : "Failed to load product details.";
      setTimeout(() => (error = null), 3000);
      products = [];
      totalPrice = 0;
    }
  }

  // Add success message
  function addImessage(text) {
    const newMessage = { id: Date.now(), text };
    imessages = [...imessages, newMessage];
    setTimeout(() => {
      imessages = imessages.filter((msg) => msg.id !== newMessage.id);
    }, 3000);
  }

  // Update quantity
  function updateQuantity(product_id, size_id, delta) {
    if (!browser) return;
    const itemIndex = cart.findIndex(
      (item) => item.product_id === product_id && item.size_id === size_id
    );
    if (itemIndex === -1) return;

    const product = products.find(
      (p) => p.product_id === product_id && p.size_id === size_id
    );
    const newQuantity = cart[itemIndex].quantity + delta;

    if (newQuantity < 1) {
      cart.splice(itemIndex, 1);
      addImessage(`${product.productname} (${product.size}) removed from cart`);
    } else if (newQuantity > product.stock_quantity) {
      error = `Only ${product.stock_quantity} ${product.size} available in stock`;
      setTimeout(() => (error = null), 3000);
      return;
    } else {
      cart[itemIndex].quantity = newQuantity;
      addImessage(
        `Updated ${product.productname} (${product.size}) to ${newQuantity}`
      );
    }

    cart = [...cart];
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
  }

  // Remove item
  function removeItem(product_id, size_id) {
    if (!browser) return;
    const product = products.find(
      (p) => p.product_id === product_id && p.size_id === size_id
    );
    cart = cart.filter(
      (item) => !(item.product_id === product_id && item.size_id === size_id)
    );
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
    if (product) {
      addImessage(`${product.productname} (${product.size}) removed from cart`);
    }
  }

  // Navigate to checkout
  function proceedToCheckout() {
    if (browser && totalItems > 0) {
      goto("/login?redirect=/checkout");
    }
  }

  // Initialize and listen for updates
  onMount(() => {
    if (browser) {
      loadCart();
      window.addEventListener("cartUpdated", loadCart);
    }
    return () => {
      if (browser) {
        window.removeEventListener("cartUpdated", loadCart);
      }
    };
  });

 
</script>



{#if error}
  <div class="error-message">{error}</div>
{/if}

{#each imessages as msg, index (msg.id)}
  <div class="imessage" style="bottom: calc(7% + {index * 44}px);">
    {msg.text}
  </div>
{/each}
<div class="cart-page" >
  

<div class="cart-uno">
  <h1>Your Cart</h1>
  {#if cart.length === 0}
    <p>Your cart is empty.</p>
    <button class="continue-shopping" on:click={() => goto("/products")}>
      Continue Shopping
    </button>
  {:else}
    <div class="cart-items">
      {#each products as product (product.product_id + product.size_id)}
        <div class="cart-item" >
          <div class="item-image"  on:click={openProductPage(product.product_id)} role>
            <img
              src={product.images[0]?.imageurl || "/fallback-image.jpg"}
              alt={product.productname || "Product"}
              loading="lazy"
            />
          </div>
          <div class="item-details">
            <h2  on:click={openProductPage(product.product_id)} role>{product.productname || "Unknown Product"}</h2>
            <p>Size: {product.size}</p>
            <p>
              Price: ${product.discountprice || product.price || 0}
              {#if product.discountprice}
                <span class="original-price">${product.price || 0}</span>
              {/if}
            </p>
            <div class="quantity-control">
              <button
                on:click={() =>
                  updateQuantity(product.product_id, product.size_id, -1)}
                disabled={product.quantity <= 1}
                aria-label="Decrease quantity"
              >
                <Icon icon="mdi:minus" />
              </button>
              <span>{product.quantity}</span>
              <button
                on:click={() =>
                  updateQuantity(product.product_id, product.size_id, 1)}
                disabled={product.quantity >= product.stock_quantity}
                aria-label="Increase quantity"
              >
                <Icon icon="mdi:plus" />
              </button>
            </div>
            <button
              class="remove-btn"
              on:click={() => removeItem(product.product_id, product.size_id)}
              aria-label="Remove item"
            >
              <Icon icon="mdi:trash-can-outline" /> Remove
            </button>
          </div>
        </div>
      {/each}
    </div>
    {/if}
    </div>
    
    <div class="cart-summary">
      <h3>Summary</h3>
      <p>Total Items: {totalItems}</p>
      <p>Total Price: ${(totalPrice || 0).toFixed(2)}</p>
      <button
        on:click={proceedToCheckout}
        disabled={totalItems === 0}
        aria-label="Proceed to checkout"
      >
        Proceed to Checkout
      </button>
      <button
        class="continue-shopping"
        on:click={() => goto("/products")}
        aria-label="Continue shopping"
      >
        Continue Shopping
      </button>
    </div>
  

</div>


<style>
  .cart-page {
    padding: 20px;
    margin: 0 auto;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    
    
  }
  .cart-uno{
    flex:  0 0 60%;

  }
  .cart-items {
    display: flex;
    flex-direction: column;
    gap: 20px;
    
  }
  .cart-item {
    display: flex;
    gap: 20px;
    border-bottom: 1px solid #e0e0e0;
    padding-bottom: 20px;
  }
  .item-image img {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  .item-details {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .item-details h2 {
    font-size: 20px;
    margin: 0;
    color: #333;
  }
  .item-details p {
    margin: 0;
    color: #555;
  }
  .original-price {
    text-decoration: line-through;
    color: #888;
    margin-left: 10px;
    font-size: 14px;
  }
  .quantity-control {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .quantity-control button {
    background: #f5f5f5;
    border: none;
    padding: 6px;
    cursor: pointer;
    border-radius: 4px;
    font-size: 16px;
    line-height: 1;
  }
  .quantity-control button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  .quantity-control span {
    font-size: 16px;
    min-width: 24px;
    text-align: center;
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
  }
  .remove-btn:hover {
    color: #b71c1c;
  }
  .cart-summary {
    margin-top: 20px;
    padding: 20px;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    background: #fafafa;
    flex: 0 0 30%;
    align-self: flex-start;
    
  }
  .cart-summary h3 {
    margin: 0;
    font-size: 18px;
    color: #333;
  }
  .cart-summary p {
    margin: 0;
    color: #555;
  }
  .cart-summary button {
    background: #000;
    color: #fff;
    padding: 10px;
    border: none;
    cursor: pointer;
    border-radius: 4px;
    font-size: 16px;
  }
  .cart-summary button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  .continue-shopping {
    background: #fff;
    color: #000;
    border: 1px solid #000;
  }
  .continue-shopping:hover {
    background: #f5f5f5;
  }
  .error-message {
    background: #ff4500;
    color: #fff;
    padding: 10px;
    text-align: center;
    position: fixed;
    width: 100%;
    max-width: 1200px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 2000;
    box-sizing: border-box;
  }
  .imessage {
    background: #4caf50;
    color: #fff;
    padding: 10px;
    text-align: center;
    position: fixed;
    width: 100%;
    max-width: 1200px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 2000;
    box-sizing: border-box;
  }
  @media (max-width: 768px) {
    .cart-item {
      flex-direction: column;
      align-items: flex-start;
    }
    .item-image img {
      width: 80px;
      height: 80px;
    }
    .cart-page {
      padding: 10px;
    }
    .error-message,
    .imessage {
      width: 100%;
      left: 0;
      transform: none;
      max-width: none;
    }
  }
</style>
