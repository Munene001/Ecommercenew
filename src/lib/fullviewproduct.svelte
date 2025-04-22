<script>
  import { once } from "lodash-es";
  import Icon from "@iconify/svelte";
  import Recentlyview from "./recentlyview.svelte";
  import Cartadd from "./cartadd.svelte";
  import { onMount, beforeUpdate } from "svelte";
  import { browser } from "$app/environment";
  import { goto } from "$app/navigation";
  import { page } from "$app/navigation";
  import Review from "./review.svelte";
  import {authStore} from "../stores/auth"

  export let product = {
    productname: "",
    description: "",
    price: 0,
    status: "",
    discountprice: 0,
    images: [],
    productdescriptions: [],
    productsizes: [],
    product_id: "",
    review_count: 0,
    average_rating: 0,
  };

  let {
    images = [],
    productname,
    description,
    price,
    discountprice,
    status,
    productdescriptions,
    productsizes,
    product_id,
    review_count,
    average_rating,
  } = product;
 

  let currentIndex = 0;
  let activeTab = "desc";
  let cartQuantity = 0; // For single-size UI
  let cart = [];
  let showModal = false;
  let dialog;
  let message;
  let imessage;
  let isAuthenticated = false;
  let isLoading = true;

  authStore.subscribe(({isAuthenticated: auth}) =>{
    isAuthenticated = auth;
  });
 

  // Safe cart access
  function getCart() {
    try {
      return JSON.parse(localStorage.getItem("cart")) || [];
    } catch (e) {
      console.error("Error loading cart:", e);
      return [];
    }
  }

  // Sync cart state and update cartQuantity for single-size
  function syncCartState() {
    cart = getCart();
    if (productsizes.length === 1) {
      const item = cart.find(
        (i) =>
          i.product_id === product_id && i.size_id === productsizes[0].size_id
      );
      cartQuantity = item ? item.quantity : 0;
    }
  }

  $: if (product) {
    syncCartState();
    console.log("Product is in fullviewport", product);
  }

  onMount(() => {
    if (browser) {
      syncCartState();
    }
  });

  beforeUpdate(() => {
    if (product && product.product_id !== product_id) {
      syncCartState();
    }
  });

  function selectImage(index) {
    currentIndex = index;
  }

  function handleTouch(event) {
    if (event.touches.length > 1) return;
    const startX = event.touches[0].clientX;
    event.target.addEventListener(
      "touchend",
      (e) => {
        const endX = e.changedTouches[0].clientX;
        const diff = startX - endX;
        if (diff > 50 && currentIndex < images.length - 1) currentIndex++;
        if (diff < -50 && currentIndex > 0) currentIndex--;
      },
      { once: true }
    );
  }
  function toCart() {
    goto("/checkout");
  }
  // Modal controls
  function openModal() {
    if (!showModal && productsizes.length > 1 && dialog) {
      showModal = true;
      dialog.showModal();
    }
  }

  function closeModal() {
    if (dialog) {
      showModal = false;
      dialog.close();
    }
  }

  // Multi-size cart functions
  function incrementQuantity(sizeId) {
    if (!browser) return;
    const sizeObj = productsizes.find((s) => s.size_id === sizeId);
    const existingItemIndex = cart.findIndex(
      (item) => item.product_id === product_id && item.size_id === sizeId
    );
    const currentQty =
      existingItemIndex === -1 ? 0 : cart[existingItemIndex].quantity;

    if (currentQty >= sizeObj.stock_quantity) {
      message = `Only ${sizeObj.stock_quantity} ${sizeObj.size} available in stock`;
      setTimeout(() => (message = ""), 1500);
      return;
    }

    if (existingItemIndex === -1) {
      cart.push({ product_id, size_id: sizeId, quantity: 1 });
    } else {
      cart[existingItemIndex].quantity++;
    }

    cart = [...cart]; // Trigger reactivity
    localStorage.setItem("cart", JSON.stringify(cart));
    imessage = "Product added succesfully to cart";
    setTimeout(() => (imessage = ""), 1500);
    window.dispatchEvent(new Event("cartUpdated"));
    console.log("After increment, cart:", cart);
  }

  function decrementQuantity(sizeId) {
    if (!browser) return;
    const existingItemIndex = cart.findIndex(
      (item) => item.product_id === product_id && item.size_id === sizeId
    );

    if (existingItemIndex !== -1 && cart[existingItemIndex].quantity > 0) {
      cart[existingItemIndex].quantity--;
      if (cart[existingItemIndex].quantity === 0) {
        cart.splice(existingItemIndex, 1);
      }

      cart = [...cart]; // Trigger reactivity
      localStorage.setItem("cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("cartUpdated"));
      console.log("After decrement, cart:", cart);
    }
  }

  function getQuantityForSize(sizeId) {
    const item = cart.find(
      (i) => i.product_id === product_id && i.size_id === sizeId
    );

    return item ? item.quantity : 0;
  }
  $: console.log("Reactive cart change:", cart);

  // Single-size legacy cart functions
  function addToCartLegacy() {
    if (!browser || productsizes.length !== 1) return;
    const sizeObj = productsizes[0];
    const existingItemIndex = cart.findIndex(
      (item) =>
        item.product_id === product_id && item.size_id === sizeObj.size_id
    );
    const currentQty =
      existingItemIndex === -1 ? 0 : cart[existingItemIndex].quantity;

    if (currentQty >= sizeObj.stock_quantity) {
      message = `Only ${sizeObj.stock_quantity} ${sizeObj.size} available in stock`;
      setTimeout(() => (message = ""), 1500);

      return;
    }

    if (existingItemIndex === -1) {
      cart.push({ product_id, size_id: sizeObj.size_id, quantity: 1 });
    } else {
      cart[existingItemIndex].quantity++;
    }

    cart = [...cart]; // Trigger reactivity
    cartQuantity = getQuantityForSize(sizeObj.size_id); // Sync UI
    localStorage.setItem("cart", JSON.stringify(cart));
    imessage = "Product added succesfully to cart";
    setTimeout(() => (imessage = ""), 1500);
    window.dispatchEvent(new Event("cartUpdated"));
  }

  function incrementQuantityLegacy() {
    addToCartLegacy();
  }

  function decrementQuantityLegacy() {
    if (!browser || productsizes.length !== 1) return;
    const sizeId = productsizes[0].size_id;
    const existingItemIndex = cart.findIndex(
      (item) => item.product_id === product_id && item.size_id === sizeId
    );

    if (existingItemIndex !== -1 && cart[existingItemIndex].quantity > 0) {
      cart[existingItemIndex].quantity--;
      if (cart[existingItemIndex].quantity === 0) {
        cart.splice(existingItemIndex, 1);
      }

      cart = [...cart]; // Trigger reactivity
      cartQuantity = getQuantityForSize(sizeId); // Sync UI
      localStorage.setItem("cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("cartUpdated"));
    }
  }
  async function addToWishlist(){
    if(!isAuthenticated){
      const redirectUrl = `/login?redirect =${encodeURIComponent($page.url.pathname)}`;
      goto(redirectUrl);
      return;
    }
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch ("http://127.0.0.1:8000/api/wishlist",{
        method: "POST",
        headers:{
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({product_id}),

      });
      if (response.ok){
        imessage = "Product added to wishlist!";
        setTimeout(() =>(imessage = "", 1500));
      } else{
        message = "Failed to add to wishlist";
        setTimeout(() =>(imessage = "", 1500));
        
      }
      
    } catch (error) {
      console.error("Error adding to wishlist", error);
      message = "Error adding to wishlist";
      setTimeout(() => (message = ""), 1500);
      
    }
  }
  
</script>

{#if imessage}
  <div class="imessage">{imessage}</div>
{/if}
{#if message}
  <div class="stockermessage">{message}</div>
{/if}

{#if product && product.product_id}
  <div class="product-container">
    <div class="pronto">
      <div class="image">
        <div class="main-image" on:touchstart={handleTouch}>
          <img
            src={images[currentIndex]?.imageurl || "fallback-image.jpg"}
            alt="Product view {currentIndex + 1}"
            loading="lazy"
            draggable="false"
          />
        </div>
        <div class="thumbnails">
          {#each images as image, index}
            <button
              class:active={index === currentIndex}
              on:click={() => selectImage(index)}
              aria-label="show image{index + 1}"
              aria-current={index === currentIndex}
            >
              <img
                src={image.imageurl || "fallback-image.jpg"}
                alt=""
                role="presentation"
                loading="lazy"
                draggable="false"
              />
            </button>
          {/each}
        </div>
      </div>
    </div>
    <div class="action">
      <div class="productname">{productname}</div>
      <div class="pricer">
        {#if discountprice}
          <div class="price">{price}</div>
          <div class="discount">{discountprice}</div>
        {:else}
          <div class="price-lone">{price}</div>
        {/if}
      </div>
      <div class="description">{description}</div>
      <div class="status">{status}</div>
      <div class="sizer">
        <p class="titler">Size guide (pick a size)</p>
        <div class="spec">
          {#each productsizes as size}
            <button
              class="size"
              on:click={productsizes.length > 1 ? openModal : null}
            >
              {size.size} ({size.stock_quantity} left)
            </button>
          {/each}
        </div>
      </div>
      {#if productsizes.length === 1}
        <div class="check">
          <div class="arithmetical">
            <button on:click={decrementQuantityLegacy} role>-</button>
            <span>{cartQuantity}</span>
            <button on:click={incrementQuantityLegacy} role class="increment"
              >+</button
            >
          </div>
          <button class="incarto" on:click={addToCartLegacy}>Add to Cart</button
          >
        </div>
      {:else}
        <div class="check">
          <button class="incart" on:click={openModal}>Add to Cart</button>
        </div>
      {/if}

      <div class="xtra">
        <button class="extra" on:click={addToWishlist}>
          <span><Icon icon="ph:heart-thin" /></span>Add to wishlist
        </button>
        <button class="extra">
          <span><Icon icon="material-symbols-light:share-outline" /></span>Share
          Product
        </button>
      </div>
    </div>
    <div class="farleft"><Recentlyview currentProduct={product} /></div>
  </div>
{:else}
  <p>No product available</p>
{/if}

{#if productsizes.length > 1}
  <dialog
    bind:this={dialog}
    on:close={closeModal}
    on:click={(e) => {
      if (e.target === dialog) closeModal();
    }}
    role
  >
    <div class="modal-content">
      {#if message}
        <div class="stockmessage">{message}</div>
      {/if}
      <div class="m-h">
        <div class="m-header">Please Select a Size</div>
        <button on:click={closeModal}><Icon icon="mdi:close" /></button>
      </div>
      <div class="size-options">
        {#each productsizes as size}
          <div class="size-row">
            <span>{size.size} ({size.stock_quantity} left)</span>
            <div class="arithmetic">
              <button
                on:click={() => decrementQuantity(size.size_id)}
                class="decrement">-</button
              >
              <span>{getQuantityForSize(size.size_id)}</span>
              <button
                on:click={() => incrementQuantity(size.size_id)}
                class="increment">+</button
              >
            </div>
          </div>
        {/each}
      </div>
      <div class="m-closer">
        <button on:click={toCart} class="tocart">Go to Cart</button>
        <button on:click={closeModal} class="remove">Continue Shopping</button>
      </div>
    </div>
  </dialog>
{/if}

<div class="desc-review">
  <div class="btn-section">
    <button
      class="desc-reviewbtn"
      class:active={activeTab === "desc"}
      on:click={() => (activeTab = "desc")}
    >
      Full Description
    </button>
    <button
      class="desc-reviewbtn"
      class:active={activeTab === "additional_information"}
      on:click={() => (activeTab = "additional_information")}
    >
      Additional Information
    </button>
    <button
      class="desc-reviewbtn"
      class:active={activeTab === "reviews"}
      on:click={() => (activeTab = "reviews")}
    >
      Reviews({review_count})
    </button>
  </div>
  <div class="desc-reviewctn">
    {#if activeTab === "desc"}
      <div>
        {productdescriptions[0]?.short_description ||
          "No description available"}
      </div>
    {:else if activeTab === "additional_information"}
      <div>
        {productdescriptions[0]?.additional_information || "No additional info"}
      </div>
    {:else}
      <Review {product_id} {average_rating} {review_count} {productname} />
    {/if}
  </div>
</div>

<style>
  .stockmessage {
    z-index: 2000;
    background-color: orangered;
    color: white;
    font-size: 22px;
    line-height: 34px;
    text-align: center;
    width: 100%;
  }
  .imessage {
    z-index: 2000;
    background-color: green;
    color: white;
    font-size: 22px;
    line-height: 34px;
    text-align: center;
    width: 100%;
  }
  .stockermessage {
    z-index: 2000;
    background-color: orangered;
    color: white;
    font-size: 22px;
    line-height: 34px;
    text-align: center;
    width: 100%;
  }
  .product-container {
    padding: 10px 20px;
    display: flex;
    flex-direction: row;
    box-sizing: border-box;
  }
  .pronto {
    flex: 0 0 43%;
  }
  .image {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .main-image {
    width: 100%;
    height: 600px;
    object-fit: scale-down;
  }
  .main-image img {
    width: 100%;
    height: 100%;
    border: 1px solid gray;
  }
  .thumbnails {
    display: flex;
    flex-direction: row;
    gap: 15px;
  }
  .thumbnails button {
    height: 77px;
    width: 77px;
    padding: 0;
    border: none;
    background-color: transparent;
    box-sizing: border-box;
  }

  .thumbnails button img {
    height: 77px;
    width: 77px;
    object-fit: cover;
  }
  .action {
    flex: 0 0 42%;
    display: flex;
    flex-direction: column;
    gap: 25px;
    padding: 20px 30px;
    box-sizing: border-box;
  }
  .pricer {
    display: flex;
    flex-direction: row;
    gap: 10px;
  }
  .price {
    text-decoration: line-through;
    font-size: 18px;
    font-weight: 400;
    line-height: 27px;
  }
  .price-lone {
    font-size: 18px;
    font-weight: 600;
    line-height: 27px;
  }
  .discount {
    font-size: 18px;
    font-weight: 600;
    line-height: 27px;
  }
  .productname {
    font-size: 28px;
    font-weight: 400;
    line-height: 33.6px;
  }
  .description {
    font-size: 14px;
    font-weight: 400;
    line-height: 21px;
  }
  .status {
    display: inline-block;
    width: fit-content;
    padding: 2px 8px;
    background-color: #f1fbef;
    color: #52bd9d;
    font-size: 18px;
    font-weight: 600;
    line-height: 21px;
    white-space: nowrap;
  }
  .check {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
  }
  .arithmetic {
    display: inline-flex;
    width: fit-content;
    padding: 7px 15px;
    gap: 45px;
    align-items: center;
    border: 1px solid black;
  }
  .incart {
    background-color: black;
    color: white;
    padding: 15px 99px;
    font-size: 14px;
  }
  .incarto {
    background-color: black;
    color: white;
    padding: 15px 99px;
    font-size: 14px;
  }
  .xtra {
    display: flex;
    flex-direction: row;
    gap: 10px;
    border-bottom: 1px solid lightgray;
    padding-bottom: 40px;
  }
  .extra {
    display: flex;

    align-items: center;
    background-color: transparent;
    border: none;
  }
  .desc-review {
    padding: 30px 20px;
    box-sizing: border-box;
    font-size: 16px;
    display: flex;
    flex-direction: column;
    width: 100%;
    justify-content: space-between;
  }
  .desc-reviewbtn {
    border: none;
    background-color: transparent;
    font-size: 18px;
    font-weight: 500;
    line-height: 30px;
    color: rgb(136, 134, 134);
  }
  .desc-reviewctn {
    font-weight: 400;
    line-height: 24px;
    color: rgb(0, 0, 0);
    margin-top: 10px;
  }
  .desc-reviewbtn.active {
    color: black;
  }
  .btn-section {
    border-bottom: 1px solid lightgray;
    padding-bottom: 4px;
    display: flex;
    box-sizing: border-box;
  }
  .farleft {
    flex: 0 0 15%;
  }
  .sizer {
    display: flex;
    flex-direction: column;
  }
  .size {
    border: 1px solid black;
    padding: 10px 25px;
  }
  .titler {
    font-size: 15px;
    font-weight: 400;
    line-height: 21px;
  }
  .spec {
    display: flex;
    flex-direction: row;
    gap: 10px;
  }
  dialog {
    width: 400px;
    border-radius: 0.4em;
    border: none;
    padding: 0;
    position: fixed;
    top: 10%;
  }
  .m-h {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  .m-header {
    font-size: 20px;
    font-weight: 600;
    line-height: 25px;
  }

  .increment {
    background-color: orangered;
    color: white;
    font-weight: 700;
  }
  .decrement {
    font-weight: 700;
  }
  .tocart {
    background-color: transparent;
    border: 1px solid orangered;
  }
  .remove {
    background-color: transparent;
    border: 1px solid orangered;
  }
  dialog::backdrop {
    background: rgba(0, 0, 0, 0.3);
  }
  .modal-content {
    padding: 1em;
    display: flex;
    flex-direction: column;
    gap: 20px;
    top: 8px;
  }
  .m-closer {
    display: flex;
    flex-direction: row;
    gap: 20px;
    justify-content: space-between;
  }
  .size-options {
    display: flex;
    flex-direction: column;
    gap: 1em;
  }
  .size-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .arithmetic {
    display: inline-flex;
    width: fit-content;
    padding: 5px 10px;
    gap: 20px;
    align-items: center;
    border: 1px solid black;
  }
  .arithmetical {
    display: inline-flex;
    width: fit-content;
    padding: 5px 10px;
    gap: 20px;
    align-items: center;
    border: 1px solid black;
  }

  button {
    background: #eee;
    border: none;
    padding: 0.5em 1em;
    border-radius: 4px;
    cursor: pointer;
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
  @media (max-width: 768px) {
    .product-container {
      display: flex;
      flex-direction: column;
      padding: 10px 10px;
      box-sizing: border-box;
    }
    .pronto {
      flex: 0 0 100%;
    }
    .action {
      flex: 0 0 100%;
      padding: 20px 0px;
      gap: 10px;
    }
    .farleft {
      flex: 0 0 100%;
    }
    dialog {
      width: 85%;
    }
    .check {
      position: fixed;
      display: flex;
      flex-direction: row;
      position: fixed;
      bottom: 0;
      left: 0;
      background-color: white;
      height: 7%;
      padding: 0px;

      align-items: center;

      width: 100%;
      justify-content: center;
      background-color: white;
    }
    .incarto {
      background-color: black;
      color: white;
      width: 65%;
      padding: 0px;
      height: 100%;
      font-size: 20px;
    }
    .incart {
      width: 100%;
      height: 100%;
      font-size: 20px;
    }
    .arithmetical {
      width: fit-content;
      width: 35%;
      height: 100%;
      padding-left: 5px;
      background-color: transparent;

      padding: 0px 5px;
      align-items: center;
      box-sizing: border-box;
    }
    .stockermessage {
      position: fixed;
      bottom: 7%;
      width: 100%;
    }
    .imessage {
      position: fixed;
      bottom: 7%;
      width: 100%;
    }

    .thumbnails button {
      height: 58px;
      width: 58px;
      box-sizing: border-box;
    }

    .thumbnails button img {
      height: 58px;
      width: 58px;
    }
    .main-image {
      width: 100%;
      height: auto;
      max-height: 570px;
      object-fit: scale-down;
    }
    .main-image img {
      width: 100%;
      height: auto;
      max-height: 570px;
      border: 1px solid gray;
    }
    .desc-review {
      box-sizing: border-box;
    }
    .desc-reviewbtn {
      border: none;
      background-color: transparent;
      font-size: 17px;
      font-weight: 500;
      line-height: 25px;
      color: rgb(136, 134, 134);
      padding: 0px;
    }
    .btn-section {
      gap: 2px;
    }
  }
</style>
