import { redirect } from "@sveltejs/kit";
import { authStore } from "../stores/auth";

export async function load({ url, fetch, depends }) {
  depends("app:auth");

  // Skip auth check during SSR
  if (typeof window === "undefined") {
    return { authState: { isAuthenticated: false, username: null } };
  }
  let isAuthenticated = false;
  let username = null;

  authStore.subscribe(({isAuthenticated:auth, username: name }) =>{
    isAuthenticated = auth;
    username = name;
  }) ();

  const pathname = url.pathname;
  const redirectParam = url.searchParams.get("redirect");

  // Only handle redirects in load function if authenticated
  if (isAuthenticated && pathname === "/login") {
    const target = redirectParam || "/account";
    throw redirect(307, target);
  }

  return {
    authState: { isAuthenticated, username },
  };
}
