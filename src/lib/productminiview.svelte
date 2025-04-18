<script>
  import { goto } from "$app/navigation";

  export let product = {
    product_id: "",
    productname: "",
    price: 0,
    images: [],
    discountprice: 0,
  };
 
 

  let { images = [], productname, price, discountprice } = product;
  let currentIndex = 0;
  let container;
  let containerWidth = 210; // Default, updates dynamically

  function handleMouseMove(event) {
    let sectionWidth = containerWidth / images.length; // Divide image into equal parts
    let index = Math.floor(event.offsetX / sectionWidth); // Get section index
    if (index !== currentIndex && index < images.length) {
      currentIndex = index;
    }
  }

  function handleResize(event) {
    containerWidth = event.target.clientWidth;
  }

  function handleTouch(event) {
    let startX = event.touches[0].clientX;
    event.target.addEventListener(
      "touchend",
      (e) => {
        let endX = e.changedTouches[0].clientX;
        let diff = startX - endX;

        if (diff > 50) {
          if (currentIndex < images.length - 1) currentIndex++;
        } else if (diff < -50) {
          if (currentIndex > 0) currentIndex--;
        }
      },
      { once: true }
    );
  }

  function openProductPage() {
    if (!product.product_id) {
      console.error("Product id is missing");
      return;
    }
    goto(`/product/${product.product_id}`);
  }
</script>
<div class="productcontainer">
<div
  class="miniproduct"
  onclick={openProductPage}
  onkeydown={(e) => (e.key === "Enter" || e.key === "") && openProductPage()}
  tabindex="0"
  role="button"
>
  <div
    class="image-container"
    onmousemove={handleMouseMove}
    onresize={handleResize}
    ontouchstart={handleTouch}
    bind:this={container}
    role="img"
  >
    <img src={ images.length> 0 ? images[currentIndex].imageurl : [] } alt="Image {currentIndex + 1}" />
    <div class="indicators">
      {#each images as _, i}
        <div class="indicator {i === currentIndex ? 'active' : ''}"></div>
      {/each}
    </div>
  </div>
  <div class="productname">{productname}</div>
  <div class=" price">
    {#if discountprice}<div class="originalprice"><i><span style="font-size: 12px;">Ksh</span>{price}</i></div>
      <div class="discountedprice"><span style="font-size: 14px;">Ksh</span>{discountprice}</div>
      {:else}
      <div class="finalprice"> <span style="font-size: 14px;">Ksh</span>{price}</div>
      {/if}
  </div>
</div>
</div>

<style>
  :global(body) {
      margin: 0;
      padding: 0;
    }
    .productcontainer{
      padding-left: 28px;
      
    }

  .miniproduct {
    height: 410px;
    width: 207px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .image-container {
    width: 100%;
    max-width: 210px;
    height: 310px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid lightgray;
    
    overflow: hidden;
    cursor: pointer;
    background-color: transparent;
  }

  .image-container img {
    width: 100%;
    height: 100%;
    object-fit: scale-down;
  }
  .indicators {
    position: absolute;
    bottom: 0;
    width: 100%;
    display: flex;
    gap: 2px;
  }

  .indicator {
    flex: 1;
    height: 4px; /* Thin bar */
    background-color: rgba(255, 255, 255, 0.5);
    transition: background-color 0.3s;
  }

  .indicator.active {
    background-color: black; /* Active image indicator */
  }
  .productname {
    font-size: 15px;
    font-weight: 400;
    line-height: 18px;
    margin-top: 8px;
    font-family: Jost, sans-serif;
  }
  .price {
    line-height: 22.5px;
    font-weight: 700;
    font-size: 17px;
    margin-top: 8px;
    display: flex;
    flex-direction: row;
    gap: 6px;
  }
  .originalprice{
    text-decoration: line-through;
    font-size: 15px;
    color: gray;
    
  }
  @media(max-width:768px){
    .productcontainer{
      display: flex;
      padding-left: 8px;
      padding-right: 8px;


    }
    .miniproduct{
      width: calc(50vw - 22px);
      height: 370px;
      
      

    }
    .image-container{
      width: 98%;
      height:65%;
    }

  }
</style>
