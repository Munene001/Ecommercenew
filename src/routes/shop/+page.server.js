export async function load() {
  const API_URL = 'http://127.0.0.1:8000/api/shop/shop-uuid-1/products';

  try {
    const response = await fetch(API_URL);
    
    if (!response.ok) {
      return { products: [] }; // ✅ Always return a plain object
    }

    const data = await response.json();
    return { products: data.products || [] }; // ✅ Ensure a valid return
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return { products: [] }; // ✅ Return an empty array on failure
  }
}
