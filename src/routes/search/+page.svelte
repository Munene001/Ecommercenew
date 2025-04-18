<script>
  
  
  import Icon from "@iconify/svelte";
  import { debounce } from "lodash-es";
  import { openProductPage } from "../../lib/productutil.js";

  /**
   * @type {{ focus: () => void; }}
   */
  let searchQuery = "";
  let searchResults = [];
  let input;
  const handleSearch = debounce(async () => {
    if (!searchQuery.trim()) {
      searchResults = [];
      return;
    }

    try {
      const params = new URLSearchParams({
        query: searchQuery,
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
</script>


<div class="quiz">What are you looking for?</div>
<div class="sear">
  <div class="searchicon">
  <input
    type="text"
    bind:this={input}
    bind:value={searchQuery}
    placeholder="Search for you favourite product"
    oninput={handleSearch}
  />
  <button onclick={handleSearch}
    ><Icon icon="iconamoon:search-thin" style="font-size:22px" /></button
  >
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



<style>
  :global(body) {
    margin: 0;
    padding: 0;
  }

  .quiz {
    font-size: 14px;
    font-weight: 400;
    line-height: 21px;
    padding: 0px 13px;
    margin-top: 28px;
  }
  .sear {
    padding: 0px 13px;
    margin-top: 18px;
    display: flex;
    flex-direction: column;
    position: relative;
    height: 100vh;
  }
  .searchicon{
    display: flex;
    flex-direction: row;
  }
  .sear .search-results {
    position: relative;
    box-sizing: border-box;
    padding: 3px 15px;
    max-height: 500px;
    overflow-y: auto;
   
  }
  .sear .no-results {
    position: absolute;
    width: 100%;
    left: 0;
    right: 0;
    top: 100%;
    box-sizing: border-box;
    padding: 3px 15px;
  }
  .results {
    display: flex;
    flex-direction: row;
    height: 70px;
    border-bottom: 1px solid gray;
  }
  .resultimg {
    flex: 10%;
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
    justify-content: center;
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

  .sear input {
    width: 90%;
    border: none;
    border-bottom: 2px solid rgba(128, 128, 128, 0.2);
    outline: none;
    padding-bottom: 9px;
    font-size: 14px;
    font-weight: 400;
    line-height: 21px;
  }
  .sear input:focus {
    border: none;

    border-bottom: 2px solid rgba(128, 128, 128, 0.2);
  }
  .sear button {
    background-color: transparent;
    border: none;
    padding-bottom: 9px;
  }
</style>
