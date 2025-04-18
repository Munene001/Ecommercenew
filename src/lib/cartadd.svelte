<script>
  
</script>

<div class="check">
  <div class="mini">
    <div class="arithmetic">
      <button>-</button><span>1</span><button>+</button>
    </div>
    <button class="incart">Add to Cart</button>
  </div>
</div>

<style>
  .check {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
    position: fixed;
    bottom: 0;
    left: 0;
    background-color: white;
    height: 70px;
    align-items: center;
    width: 100%;
    justify-content: center;
  }
  .mini {
    display: flex;
    flex-direction: row;
    gap: 10px;
  }
  .arithmetic {
    display: inline-flex;
    width: fit-content;
    height: 40px;
    width: 30vw;
    gap: 45px;
    align-items: center;
    border: 1px solid black;
  }
  .incart {
    background-color: black;
    color: white;
    height: 42px;
    width: 60vw;

    font-size: 14px;
  }
  @media (min-width: 769px) {
    .check {
      display: none;
    }
  }
</style>
