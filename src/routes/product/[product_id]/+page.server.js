export async function load({ params, fetch }) {
  const { product_id } = params;
 

  const API_URL = `http://127.0.0.1:8000/api/product/${product_id}/`;

  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("Failed to fetch product");
    }
    const data = await response.json();
    const product = data.product || null;
    
    return {
    
      product
      
    };
  } catch (error) {
    console.error("Error loading product:", error);
    return {
      product: null,
     
    };
  }
}
