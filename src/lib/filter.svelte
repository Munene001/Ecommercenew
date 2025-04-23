<script>
  import {
    onMount,
    createEventDispatcher,
    onDestroy,
    afterUpdate,
  } from "svelte";
  import nouislider from "nouislider";
  import "nouislider/dist/nouislider.css";
  import Icon from "@iconify/svelte";

  let showShoes = false;
  let showKidsShoes = false;

  const dispatch = createEventDispatcher();

  export let visible = false;

  function closeFilter() {
    visible = false;
  }

  export let categories = [];
  export let sizes = [
    "S",
    "M",
    "L",
    "XL",
    "Eu27",
    "Eu28",
    "Eu29",
    "Eu30",
    "Eu31",
    "Eu32",
    "Eu33",
    "Eu34",
    "Eu35",
    "Eu36",
    "Eu37",
    "Eu38",
    "Eu39",
    "Eu40",
    "Eu41",
    "Eu42",
    "Eu43",
    "Eu44",
    "Eu45",
    "Eu46",
    "Eu47",
    "Eu48",
  ];
  export let colors = [
    "White",
    "Red",
    "Blue",
    "Black",
    "Green",
    "Gray",
    "Yellow",
    "Pink",
    "Purple",
    "NavyBlue",
    "Cream",
  ];
  export let minPrice = 0;
  export let maxPrice = 20000;
  export let priceMinLimit = 0;
  export let priceMaxLimit = 10000;

  export let selectedCategories = [];
  export let selectedSizes = [];
  export let selectedColors = [];

  const colorMap = {
    White: "#FFFFFF",
    Red: "#FF0000",
    Blue: "#0000FF",
    Black: "#000000",
    Green: "#008000",
    Gray: "#808080",
    Yellow: "#FFFF00",
    Pink: "#FFC1CC",
    Purple: "#800080",
    NavyBlue: "#000080",
    Cream: "#FFFDD0",
  };

  let desktopSlider; // Reference to desktop slider instance
  let mobileSlider; // Reference to mobile slider instance

  // Initialize desktop slider on mount
  onMount(() => {
    const desktopSliderElement = document.getElementById(
      "desktop-price-slider"
    );
    if (desktopSliderElement) {
      desktopSlider = nouislider.create(desktopSliderElement, {
        start: [minPrice, maxPrice],
        connect: true,
        range: { min: priceMinLimit, max: priceMaxLimit },
        step: 50,
        behaviour: "drag",
      });
      desktopSlider.on("update", (values) => {
        minPrice = Math.round(values[0]);
        maxPrice = Math.round(values[1]);
      });
    }
  });

  // Initialize mobile slider after DOM updates when visible becomes true
  afterUpdate(() => {
    if (visible && !mobileSlider) {
      const mobileSliderElement = document.getElementById(
        "mobile-price-slider"
      );
      console.log("Mobile slider element found:", mobileSliderElement); // Debug
      if (mobileSliderElement && !mobileSliderElement.noUiSlider) {
        mobileSlider = nouislider.create(mobileSliderElement, {
          start: [minPrice, maxPrice],
          connect: true,
          range: { min: priceMinLimit, max: priceMaxLimit },
          step: 50,
          behaviour: "drag",
        });
        mobileSlider.on("update", (values) => {
          minPrice = Math.round(values[0]);
          maxPrice = Math.round(values[1]);
        });
        console.log("Mobile slider initialized:", mobileSlider); // Debug
      } else {
        console.log("Mobile slider element not ready or already initialized");
      }
    }
  });

  // Cleanup sliders
  onDestroy(() => {
    if (desktopSlider) desktopSlider.destroy();
    if (mobileSlider) mobileSlider.destroy();
  });

  $: if (!visible && mobileSlider) {
    mobileSlider.destroy();
    mobileSlider = null; // Reset to allow reinitialization
  }

  export function applyPriceFilters() {
    applyFilters();
  }

  export function applyFilters() {
    const filterData = {
      categoryUuids: selectedCategories,
      sizes: selectedSizes,
      colors: selectedColors,
      minPrice,
      maxPrice,
    };
    console.log("Filter Data:", filterData);
    dispatch("filter", filterData);
  }

  function debounce(func, wait) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }
  const debounceApplyFilters = debounce(applyFilters, 300);
</script>

<div class="desktop-filter">
  <div class="filtergroup">
    <h3>Categories</h3>
    {#each categories as category}
      <label>
        <input
          type="checkbox"
          value={category.category_id}
          bind:group={selectedCategories}
          onchange={applyFilters}
        />
        {category.categoryname}
      </label>
    {/each}
  </div>
  <div class="filtergroup" id="color">
    <h3>Colors</h3>
    {#each colors as color}
      <label class="color-swatch" style="background-color: {colorMap[color]};">
        <input
          type="checkbox"
          value={color}
          bind:group={selectedColors}
          onchange={applyFilters}
        />
        <div class="check">
          <span
            class="checkmark {color === 'Cream' || color === 'White'
              ? 'black-icon'
              : ''}"
          >
            <b
              ><iconify-icon icon="material-symbols-light:check"
              ></iconify-icon></b
            >
          </span>
          <span class="color-name">{color}</span>
        </div>
      </label>
    {/each}
  </div>
  <div class="filtergroup">
    <h3>Sizes</h3>
    <h4 class="size-subtitle">Body Wear</h4>
    <div>
      {#each ["S", "M", "L", "XL"] as size}
        <label>
          <input
            type="checkbox"
            value={size}
            bind:group={selectedSizes}
            onchange={applyFilters}
          />
          {size}
        </label>
      {/each}
    </div>
    
    <div class="shoe-section-header" onclick={() => showShoes = !showShoes} role>
      <h4 class="size-subtitle">Shoes</h4>
      <Icon icon={showShoes ? "material-symbols:keyboard-arrow-up" : "material-symbols:keyboard-arrow-down"} />
    </div>
    {#if showShoes}
      <div class="size-group">
        {#each ["Eu35", "Eu36", "Eu37", "Eu38", "Eu39", "Eu40", "Eu41", "Eu42", "Eu43", "Eu44", "Eu45", "Eu46", "Eu47", "Eu48"] as size}
          <label class="size-checkbox">
            <input
              type="checkbox"
              value={size}
              bind:group={selectedSizes}
              onchange={applyFilters}
            />
            {size}
          </label>
        {/each}
      </div>
    {/if}
    
    <div class="shoe-section-header" onclick={() => showKidsShoes = !showKidsShoes} role>
      <h4 class="size-subtitle">Kids Shoes</h4>
      <Icon icon={showKidsShoes ? "material-symbols:keyboard-arrow-up" : "material-symbols:keyboard-arrow-down"} />
    </div>
    {#if showKidsShoes}
      <div class="size-group">
        {#each ["Eu27", "Eu28", "Eu29", "Eu30", "Eu31", "Eu32", "Eu33", "Eu34"] as size}
          <label class="size-checkbox">
            <input
              type="checkbox"
              value={size}
              bind:group={selectedSizes}
              onchange={applyFilters}
            />
            {size}
          </label>
        {/each}
      </div>
    {/if}
  </div>
</div>

{#if visible}
  <div class="mobile-filter">
    <div class="toper">
      <h3>Filter Products</h3>
      <button class="close" onclick={closeFilter} aria-label="close"
        ><Icon
          icon="material-symbols:close-rounded"
          style="font-size:21px;"
        /></button
      >
    </div>
    <div class="filtergroup">
      <h3>Categories</h3>

      {#each categories as category}
        <label>
          <input
            type="checkbox"
            value={category.category_id}
            bind:group={selectedCategories}
            onchange={applyFilters}
          />
          {category.categoryname}
        </label>
      {/each}
    </div>
    <div class="filtergroup">
      <h3>Price</h3>
      <div class="pricer">
        <p>price: {minPrice} Ksh - {maxPrice} Ksh</p>
        <button class="bt" onclick={applyPriceFilters}>Filter Price</button>
      </div>
      <div id="mobile-price-slider" class="range-slider"></div>
    </div>
    <div class="filtergroup" id="color">
      <h3>Colors</h3>
      {#each colors as color}
        <label
          class="color-swatch"
          style="background-color: {colorMap[color]};"
        >
          <input
            type="checkbox"
            value={color}
            bind:group={selectedColors}
            onchange={applyFilters}
          />
          <div class="check">
            <span
              class="checkmark {color === 'Cream' || color === 'White'
                ? 'black-icon'
                : ''}"
            >
              <b
                ><iconify-icon icon="material-symbols-light:check"
                ></iconify-icon></b
              >
            </span>
            <span class="color-name">{color}</span>
          </div>
        </label>
      {/each}
    </div>
    <div class="filtergroup">
      <h3>Sizes</h3>
      <h4 class="size-subtitle">Body Wear</h4>
      <div>
        {#each ["S", "M", "L", "XL"] as size}
          <label>
            <input
              type="checkbox"
              value={size}
              bind:group={selectedSizes}
              onchange={applyFilters}
            />
            {size}
          </label>
        {/each}
      </div>
      
      <div class="shoe-section-header" onclick={() => showShoes = !showShoes} role>
        <h4 class="size-subtitle">Shoes</h4>
        <Icon icon={showShoes ? "material-symbols:keyboard-arrow-up" : "material-symbols:keyboard-arrow-down"} />
      </div>
      {#if showShoes}
        <div class="size-group">
          {#each ["Eu35", "Eu36", "Eu37", "Eu38", "Eu39", "Eu40", "Eu41", "Eu42", "Eu43", "Eu44", "Eu45", "Eu46", "Eu47", "Eu48"] as size}
            <label class="size-checkbox">
              <input
                type="checkbox"
                value={size}
                bind:group={selectedSizes}
                onchange={applyFilters}
              />
              {size}
            </label>
          {/each}
        </div>
      {/if}
      
      <div class="shoe-section-header" onclick={() => showKidsShoes = !showKidsShoes} role>
        <h4 class="size-subtitle">Kids Shoes</h4>
        <Icon icon={showKidsShoes ? "material-symbols:keyboard-arrow-up" : "material-symbols:keyboard-arrow-down"} />
      </div>
      {#if showKidsShoes}
        <div class="size-group">
          {#each ["Eu27", "Eu28", "Eu29", "Eu30", "Eu31", "Eu32", "Eu33", "Eu34"] as size}
            <label class="size-checkbox">
              <input
                type="checkbox"
                value={size}
                bind:group={selectedSizes}
                onchange={applyFilters}
              />
              {size}
            </label>
          {/each}
        </div>
      {/if}
    </div>
  </div>
{/if}

<style>
  .desktop-filter {
    flex: 0 0 22%;
    position: sticky;
    align-self: flex-start;
    display: flex;
    flex-direction: column;
    gap: 20px;
    cursor: pointer;
  }
  .filtergroup {
    display: flex;
    flex-direction: column;
  }
  .filtergroup label {
    display: block;
    margin: 5px 0;
  }
  .pricer {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 15px;
    margin-top: -15px;
  }
  .bt {
    font-size: 12px;
    height: auto;
    padding: 0px 7px;
    margin: 0;
    line-height: 1;
    height: 24px;
    align-self: center;
  }
  #desktop-price-slider,
  #mobile-price-slider {
    height: 5px;
  }
  .range-slider {
    margin: 0px 10px;
    background-color: #ee403d;
  }
  :global(#desktop-price-slider .noUi-connect),
  :global(#mobile-price-slider .noUi-connect) {
    background: #ee403d;
  }
  :global(#desktop-price-slider .noUi-base),
  :global(#mobile-price-slider .noUi-base) {
    height: 3px;
    background: #d3d3d3;
    display: flex;
    align-self: center;
  }
  :global(#desktop-price-slider .noUi-handle),
  :global(#mobile-price-slider .noUi-handle) {
    border-radius: 50%;
    border-color: #ee403d;
    background: #ee403d;
    cursor: pointer;
    top: -13px !important;
  }
  :global(#desktop-price-slider .noUi-handle:before),
  :global(#desktop-price-slider .noUi-handle:after),
  :global(#mobile-price-slider .noUi-handle:before),
  :global(#mobile-price-slider .noUi-handle:after) {
    display: none;
  }
  #color {
    padding-top: 8px;
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
  }
  .color-swatch input[type="checkbox"] {
    opacity: 0;
    position: absolute;
  }
  .color-swatch {
    display: inline-block;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    margin: 5px;
    cursor: pointer;
    position: relative;
    border: 2px solid transparent;
    transition: border-color 0.2s ease;
    align-items: center;
  }
  .color-swatch .checkmark {
    display: none;
  }
  .check {
    display: flex;
    flex-direction: row;
    gap: 20px;
    width: 10px;
  }
  .color-name {
    padding-left: 25px;
    display: flex;
    align-items: center;
    font-size: 14px;
    font-weight: 400;
    line-height: 21px;
  }
  .color-swatch input[type="checkbox"]:checked ~ .check .checkmark {
    display: block;
  }
  iconify-icon {
    align-self: center;
    justify-self: center;
  }
  .mobile-filter {
    display: flex;
    width: 90%;
    position: fixed;
    top: 0%;
    left: 0%;
    bottom: 9vh;
    padding: 0px 15px;
    box-sizing: border-box;
    z-index: 100;
    background-color: white;
    flex-direction: column;
    overflow-y: auto;
  }
  .toper {
    display: flex;
    flex-direction: row;

    justify-content: space-between;
    padding-bottom: 10px;
    border-bottom: 1px solid black;
  }
  .close {
    box-sizing: border-box;
    border: none;
    background-color: transparent;
  }
  .size-subtitle {
    margin: 10px 0 5px 0;
    font-size: 14px;
    font-weight: 500;
    color: #555;
  }

  .size-group {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }

  .size-checkbox {
    display: flex;
    align-items: center;
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    cursor: pointer;
  }

  

  .size-checkbox input[type="checkbox"] {
    margin-right: 8px;
  }
  @media (max-width: 768px) {
    .desktop-filter {
      display: none;
    }
    .size-subtitle {
      margin: 10px 0 5px 0;
      font-size: 14px;
      font-weight: 500;
      color: #555;
    }

    .size-group {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
    }

    .size-checkbox {
      display: flex;
      align-items: center;
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      cursor: pointer;
    }


    .size-checkbox input[type="checkbox"] {
      margin-right: 8px;
    }
  }
  @media (min-width: 769px) {
    .mobile-filter {
      display: none;
    }
  }
</style>
