<script>
  
  import Productminiview from "$lib/productminiview.svelte";
  import Navigationbar from "$lib/navigationbar.svelte";
  
  import Icon from "@iconify/svelte";
  import Filter from "../../lib/filter.svelte";
  import { onMount } from "svelte";

  let filterVisible = false;
  function toggleFilter() {
    filterVisible = !filterVisible;
  }

  export let data;
  let products = [];
  let totalResults = 0;
  let shopId = data.shopId || "shop-uuid-1";

  // Pagination state
  let currentPage = 1;
  let totalPages = 1;
  let loading = false;
  let activeFilters = {}; // Track current filters

  let categories = [];

  // Fetch categories and initial products on mount
  onMount(async () => {
    try {
      // Fetch categories
      const categoriesResponse = await fetch(
        `http://127.0.0.1:8000/api/products/categories?shop_id=${shopId}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );
      if (!categoriesResponse.ok) throw new Error("Failed to fetch categories");
      categories = await categoriesResponse.json();
      
      // Fetch initial products with pagination
      await fetchProducts({}, 1);
    } catch (error) {
      console.error("Error initializing:", error);
      categories = [
        { category_id: "category-uuid-1", categoryname: "Men" },
        { category_id: "category-uuid-2", categoryname: "Women" },
        { category_id: "category-uuid-3", categoryname: "Shoes" },
        { category_id: "category-uuid-4", categoryname: "Bags" },
        { category_id: "category-uuid-5", categoryname: "Hats" },
        { category_id: "category-uuid-7", categoryname: "Kids" },
      ];
    }
  });

  // Handle filter changes
  function handleFilter(event) {
    const filterData = event.detail;
    activeFilters = filterData;
    currentPage = 1; // Reset to first page when filters change
    fetchProducts(filterData, 1);
  }

  // Universal product fetching function with pagination
  async function fetchProducts(filterData = {}, page = 1) {
    try {
      loading = true;
      const response = await fetch(
        `http://127.0.0.1:8000/api/products/filter?page=${page}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            ...filterData,
            page: page
          }),
        }
      );
      
      if (!response.ok) throw new Error("Failed to fetch products");
      
      const result = await response.json();
      products = result.products;
      totalResults = result.total;
      totalPages = result.last_page || 1;
      currentPage = page;
    } catch (error) {
      console.error("Error fetching products:", error);
      products = [];
      totalResults = 0;
      totalPages = 1;
    } finally {
      loading = false;
    }
  }

  // Change page
  function changePage(page) {
    if (page < 1 || page > totalPages || page === currentPage) return;
    fetchProducts(activeFilters, page);
  }
</script>



<div class="shoping">
  <!-- Filter Component -->
  <Filter {categories} on:filter={handleFilter} bind:visible={filterVisible} />
 
  <div class="main-content">
    <div class="float">
      <div class="product-count">
        <Icon icon="mdi:package-variant" style = "font-size:39px"/>
        <span>{totalResults} products found</span>
      </div>
      <div class="flot">
      <button onclick={toggleFilter} class="filter-btn">
        <Icon icon="material-symbols-light:filter-list" style="font-size:39px;" />
      </button>
      <span>filter</span>
      </div>
      
    </div>
    
    <!-- Product count display -->
    
    
    <!-- Product List -->
    {#if loading}
      <div class="loading">Loading...</div>
    {:else if products.length > 0}
      <div class="products-container">
        {#each products as product (product.product_id)}
          <Productminiview {product} />
        {/each}
      </div>
      
      <!-- Pagination Controls -->
      <div class="pagination">
        <button 
          class="pagination-button" 
          onclick={() => changePage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        
        {#each Array(totalPages) as _, i}
          {#if i + 1 === currentPage}
            <span class="current-page">{i + 1}</span>
          {:else if i + 1 >= currentPage - 2 && i + 1 <= currentPage + 2}
            <button 
              class="pagination-button" 
              onclick={() => changePage(i + 1)}
            >
              {i + 1}
            </button>
          {/if}
        {/each}
        
        <button 
          class="pagination-button" 
          onclick={() => changePage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    {:else}
      <p>No products found.</p>
    {/if}
  </div>
</div>

<Navigationbar {filterVisible} toggleFilterCallback={toggleFilter} />


<style>
  .shoping {
    display: flex;
    flex-direction: row;
    padding: 10px;
    box-sizing: border-box;
  }
  
  .main-content {
    flex: 1;
  }
  .float{
    padding: 10px 13px;
  }
  
  .flot {
    display: none;
  }
  
  .loading {
    text-align: center;
    padding: 20px;
  }
  
  .product-count {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 14px;
    
  }

  .products-container {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 15px;
    max-height: 976px;
    overflow-y: auto;
    box-sizing: border-box;
    scroll-behavior: smooth;
  }
  
  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    margin-top: 20px;
    padding: 10px;
  }
  
  .pagination-button {
    padding: 5px 10px;
    border: 1px solid #ddd;
    background: white;
    cursor: pointer;
    border-radius: 4px;
  }
  
  .pagination-button:hover:not([disabled]) {
    background: #f0f0f0;
  }
  
  .pagination-button[disabled] {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .current-page {
    padding: 5px 10px;
    background: #ee403d;
    color: white;
    border-radius: 4px;
  }

  @media (max-width: 768px) {
    .shoping {
      padding: 0 8px;
    }
    .flot{
      display: block;
      display: flex;
      flex-direction: row;
      align-items: center;
      box-sizing: border-box;
      gap: 2px
     
    }
    .flot span{
      font-size: 14px;
    }
    .float{
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      
    }
    
    
    
     
    
    .filter-btn {
      border: none;
      background-color: transparent;
    }

    .products-container {
      grid-template-columns: repeat(2, 1fr);
      gap: 2px;
      max-height: none;
      padding-top: 0px;
    }
    
    .pagination {
      flex-wrap: wrap;
    }
  }
</style>