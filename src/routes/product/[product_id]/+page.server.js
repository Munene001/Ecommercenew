export async function load({ params, fetch, parent }) {
  const { product_id } = params;
  const { isAuthenticated, username } = await parent();
  console.log("Page load:", { isAuthenticated, username, product_id });

  const API_URL = `http://127.0.0.1:8000/api/product/${product_id}/`;

  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("Failed to fetch product");
    }
    const data = await response.json();
    const product = data.product || null;
    let pendingWishlistItem = null;
    if(isAuthenticated)
    {
        pendingWishlistItem = localStorage.getItem("wishlistPending");
    }
    return {
      isAuthenticated,
      username,
      product,
      pendingWishlistItem,
    };
  } catch (error) {
    console.error("Error loading product:", error);
    return {
      product: null,
      isAuthenticated,
      username,
      pendingWishlistItem: null,
    };
  }
}
