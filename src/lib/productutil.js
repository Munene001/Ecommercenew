import { goto } from "$app/navigation";

export function openProductPage(product_id) {
  console.log("Navigating to:", `/product/${product_id}`);

  if (!product_id) {
    console.log("product is missing");

    return;
  }

  window.location.href = `/product/${product_id}`;
  //goto(`/product/${product_id}`, { replaceState: false });
  //console.log("Goto called for:", `/product/${product_id}`);
}
