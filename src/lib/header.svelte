<script>
  import { goto } from "$app/navigation";
  import Icon from "@iconify/svelte";
  import { debounce, result, value } from "lodash-es";
  import { openProductPage } from "./productutil";
  import CartHeader from "./cartHeader.svelte";
  import Accountmodal from "./accountmodal.svelte";
  import Wishlistheader from "./wishlistheader.svelte";
  import { authStore } from "../stores/auth";

  let isAuthenticated = false;
  let username = null;
  let isLoading = true;

  authStore.subscribe(({ isAuthenticated: auth, username : name, isLoading }) => {
    isAuthenticated = auth;
    username = name || null;
    
  });

  function navigateToAccount() {
    goto("/account");
  }

  let showModal = false;
  let categories = [
    { label: "All", id: null },
    { label: "Men", id: "category-uuid-1" },
    { label: "Women", id: "category-uuid-2" },
    { label: "Shoes", id: "category-uuid-3" },
    { label: "Bags", id: "category-uuid-4" },
    { label: "Hats", id: "category-uuid-5" },
    { label: "Kids", id: "category-uuid-7" },
  ];
  let selectedCategory = categories[0];
  let showDropdown = false;
  let searchQuery = "";
  let searchResults = [];

  const handleSearch = debounce(async () => {
    if (!searchQuery.trim()) {
      searchResults = [];
      return;
    }

    try {
      const params = new URLSearchParams({
        query: searchQuery,
        categoryUuid: selectedCategory.id || "",
      });
      const API_URL = `http://127.0.0.1:8000/api/products/search?${params}`;
      const response = await fetch(API_URL);

      if (!response.ok) {
        console.log("Network response was not ok");
      }
      const data = await response.json();

      searchResults = data.map((product) => ({
        ...product,
        imageurl:
          product.images && product.images.length > 0
            ? product.images[0].imageurl
            : null,
      }));
    } catch (error) {
      console.error("Error during search:", error);
    }
  }, 300);
  function toggleDropdown() {
    showDropdown = !showDropdown;
  }

  const links = [
    {
      label: "Home",
      url: "/",
    },
    {
      label: "Shop",
      url: "/shop",
    },
    {
      label: "Men",
      url: "/men",
    },
    {
      label: "Women",
      url: "/women",
    },
    {
      label: "Checkout",
      url: "/checkout",
    },
    {
      label: "About",
      url: "/about",
    },
    {
      label: "Contact",
      url: "/contact",
    },
    {
      label: "whatsapp",
      url: "https://wa.me/0715067768",
    },
  ];
  const sidecategories = [
    {
      label: "All",
      url: "/shop",
    },
    {
      label: "Men",
      url: "/men",
    },
    {
      label: "Women",
      url: "/women",
    },
    {
      label: "Shoes",
      url: "/shoes",
    },
    {
      label: "Hats",
      url: "/hats",
    },
    {
      label: "Bags",
      url: "/bags",
    },
    {
      label: "Belts",
      url: "/belts",
    },
  ];
</script>

<div class="shopnow">
  <div class="shopnowtxt">
    DELIVERIES ARRIVE WITHIN 2 TO 3 BUSINESS DAYS! PLACE YOUR ORDER NOW @ <a
      href="/shop"
      style="text-decoration: none; color:white">SHOP</a
    >
  </div>
</div>
<div class="mainheader">
  <div class="logo"><h1>Cloyta</h1></div>
  <div class="middle">
    <div class="search-container">
      <span class="search-icon">
        <Icon icon="iconamoon:search-thin" />
      </span>
      <input
        type="text"
        bind:value={searchQuery}
        placeholder="Search for you favourite product"
        oninput={handleSearch}
      />
      <div class="dropdown">
        <button class="category" onclick={toggleDropdown}>
          {selectedCategory.label}
          <Icon
            icon="material-symbols-light:arrow-drop-down"
            style="font-size:16px"
          />
        </button>
        {#if showDropdown}
          <div class="dropdown-content">
            {#each categories as category}
              <div>
                <button
                  class="but"
                  onclick={() => {
                    selectedCategory = category;
                    handleSearch();
                    showDropdown = false;
                  }}
                >
                  {category.label}
                </button>
              </div>
            {/each}
          </div>
        {/if}
      </div>
      {#if searchResults.length > 0}
        <div class="search-results">
          {#each searchResults as result}
            <div
              class="results"
              onclick={() => openProductPage(result.product_id)}
              onkeydown={(e) =>
                (e.key === "Enter" || e.key === "") && openProductPage()}
              tabindex="0"
              role="button"
            >
              {#if result.imageurl}
                <div class="resultimg">
                  <img
                    src={result.imageurl}
                    alt={result.productname}
                    class="product-image"
                  />
                </div>
              {/if}

              <div class="resultname">{result.productname}</div>
              <div class="pricewars">
                {#if result.discountprice}
                  <div class="price">{result.price}</div>
                  <div class="discountprice">{result.discountprice}</div>
                {:else}
                  <div class="finalprice">{result.price}</div>
                {/if}
              </div>
            </div>
          {/each}
        </div>
      {:else if searchQuery !== ""}
        <div class="no-results">No results found</div>
      {/if}
    </div>
  </div>
  <div class="right">
    <Wishlistheader />
    <CartHeader />
    <Accountmodal {isAuthenticated} {username} />
  </div>
</div>
<div class="route">
  <div class="allcategories">
    <p>All Categories</p>
    <span class="down"><Icon icon="solar:alt-arrow-down-linear" /></span>
  </div>
  <div class="pageroute">
    <div class="routeitem"><a href="/" aria-label="Go to home"> HOME </a></div>
    <div class="routeitem">
      <a href="/shop" aria-label="Go to shop"> SHOP </a>
    </div>
    <div class="routeitem"><a href="/men" aria-label="Go to MEN"> MEN </a></div>
    <div class="routeitem">
      <a href="/women" aria-label="Go to WOMEN"> WOMEN </a>
    </div>
    <div class="routeitem">
      <a href="/checkout" aria-label="Go to checkout"> CHECKOUT </a>
    </div>
    <div class="routeitem">
      <a href="/about" aria-label="Go to about"> ABOUT </a>
    </div>
    <div class="routeitem">
      <a href="/contact" aria-label="Go to contact"> CONTACT </a>
    </div>
  </div>
</div>
<div class="mainheadermobile">
  <button class="menu" onclick={(e) => (showModal = true)}>
    <Icon icon="mdi-light:menu" />
  </button>
  <div class="head"><h1>Cloyta</h1></div>
  <CartHeader />
</div>
{#if showModal}
  <div class="pops">
    <div class="popsheader">
      <div class="logo2"><h1>Cloyta</h1></div>
      <button class="close" onclick={(e) => (showModal = false)}>
        <Icon icon="ic:round-close" />
      </button>
    </div>
    <div class="x">
      <div class="sidemenutitle">Main Menu</div>
      <div>
        {#each links as link}
          <button
            class="sidemenu"
            onclick={(e) => {
              goto(link.url);
              showModal = false;
            }}>{link.label}</button
          >
        {/each}
      </div>
    </div>
    <div class="x">
      <div class="sidemenutitle">Categories</div>
      <div>
        {#each sidecategories as sidecategory}
          <button
            class="sidemenu"
            onclick={(e) => {
              goto(sidecategory.url);
              showModal = false;
            }}>{sidecategory.label}</button
          >
        {/each}
      </div>
    </div>
  </div>
{/if}

<style>
  :global(body) {
    margin: 0;
    padding: 0;
  }
  .shopnow {
    height: 38px;
    background-color: #1a4845;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .shopnowtxt {
    color: #ffffff;
    font-size: 12px;
    line-height: 18px;
    font-weight: 400;
    font-family: Jost, sans-serif;
  }
  .mainheader {
    height: 84px;
    display: flex;
    flex-direction: row;
    border-bottom: 1px solid grey;
  }
  .mainheader .logo,
  .mainheader .middle,
  .mainheader .right {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .logo {
    flex: 0 0 21%;
    background-color: #ffffff;
    font-size: 28px;
  }
  .middle {
    flex: 0 0 56%;
    background-color: #ffffff;
  }
  .right {
    flex: 0 0 23%;
    background-color: #ffffff;
    display: flex;
    align-items: center;
    display: flex;
    flex-direction: row;
    gap: 30px;
  }

  .search-container {
    display: flex;
    align-items: center;
    height: 46px;
    width: 100%;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: #f0f0f0;
    position: relative;
    z-index: 20;
  }
  .search-container .search-results {
    position: absolute;
    width: 100%;
    left: 0;
    right: 0;
    top: 100%;
    max-height: 320px;
    overflow-y: auto;
  }
  .search-container .no-results {
    position: absolute;
    width: 100%;
    left: 0;
    right: 0;
    top: 100%;
  }
  .results {
    display: flex;
    flex-direction: row;
    background-color: whitesmoke;
    height: 50px;
  }
  .resultimg {
    flex: 7%;
    display: flex;
    align-items: center;
  }

  .resultimg img {
    width: 100%;
    object-fit: contain;
    height: 90%;
    margin-top: 5px;
    margin-bottom: 5px;
  }

  .resultname {
    flex: 80%;
    display: flex;
    align-items: center;
    padding-left: 10px;
  }
  .pricewars {
    display: flex;
    flex-direction: column;
    flex: 10%;
    align-items: center;
  }
  .discountprice {
    font-size: 17px;
    color: rgb(238, 22, 18);
    font-weight: 650;
    line-height: 23px;
  }
  .price {
    text-decoration: line-through;
    color: gray;
    font-size: 15px;
  }

  input[type="text"] {
    flex: 0 0 72%;
    padding: 0.5rem;
    border: none;
    height: 100%;
    box-sizing: border-box;
    outline: none;
    border-right: 1px solid #ccc;
    background-color: #f0f0f0;
  }

  .dropdown {
    flex: 0 0 28%;
    position: relative;
    height: 100%;
    margin-top: 16px;
    margin-left: 19px;
  }
  .category {
    cursor: pointer;
    font-size: 14px;
    line-height: 24px;
    border: none;
    background-color: transparent;
  }
  .dropdown-content {
    min-width: 160px;
    z-index: 1000;
    position: relative;
    align-items: flex-end;
  }
  .but {
    width: 136px;
    border: none;
    background-color: #f0f0f0;
    text-align: justify;
    font-size: 14px;
    line-height: 26px;
  }

  .but:hover {
    background-color: rgb(74, 74, 238);
  }
  .search-icon {
    margin-right: 10px;
    font-size: 20px;
    margin-left: 5px;
  }

  .route {
    height: 56px;
    border-bottom: 1px solid grey;
    display: flex;
    flex-direction: row;
  }
  .route .allcategories,
  .route .pageroute {
    display: flex;
    align-items: center;
  }
  .allcategories {
    flex: 0 0 22%;
    border-right: 1px solid gray;
    font-size: 17px;
    line-height: 25px;
    margin-left: 30px;
  }
  .down {
    margin-left: 120px;
  }
  .routeitem {
    margin-left: 60px;
  }
  .routeitem a {
    text-decoration: none;
    color: #000000;
  }
  .mainheadermobile {
    display: none;
  }
  .pops {
    display: none;
  }
  @media (max-width: 768px) {
    .shopnow {
      height: 56px;
      text-align: center;
    }
    .route {
      display: none;
    }
    .mainheader {
      display: none;
    }
    .mainheadermobile {
      height: 66px;
      display: flex;
      flex-direction: row;
      align-items: center;
      border-bottom: 1px solid gray;
      justify-content: space-between;
      padding: 0 12px;
      position: relative;
    }
    .menu {
      font-size: 31px;
      border: none;
      outline: none;
      cursor: pointer;
    }

    .head {
      font-size: 16px;
      line-height: 24px;
      font-weight: 400;
    }
    .pops {
      display: block;
      position: fixed;
      top: 0px;
      left: 0px;
      width: 290px;
      background-color: white;
      z-index: 20;
      border: 2px solid grey;
      font-size: 60px;
      border: none;
      max-height: 100vh;
      overflow-y: auto;
    }
    .popsheader {
      height: 62px;
      align-items: center;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      padding: 0 20px;
      border-bottom: 2px solid rgba(128, 128, 128, 0.2);
    }
    .logo2 {
      line-height: 24px;
      font-weight: 400;
      font-size: 16px;
    }
    .close {
      border: none;
      cursor: pointer;
      font-size: 21px;
    }
    .sidemenutitle {
      font-weight: 600;
      line-height: 21px;
      font-size: 14px;
      margin-top: 20px;
      padding-left: 20px;
    }
    .sidemenu {
      display: flex;
      flex-direction: column;
      border: none;
      cursor: pointer;
      text-decoration: none;
      background-color: white;
      font-size: 16px;
      font-weight: 400;
      line-height: 24px;
      margin-top: 15px;
      padding-left: 20px;
    }
  }
</style>
