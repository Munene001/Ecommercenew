import { redirect } from '@sveltejs/kit';

export async function load({ url, fetch, depends }) {
  depends('app:auth');

  // Skip auth check during SSR
  if (typeof window === 'undefined') {
    return { isAuthenticated: false, username:null };
  }

  const token = localStorage.getItem('authToken') || '';
  let isAuthenticated = false;
  let username = null;

  async function validateToken() {
    if (!token) return false;
    try {
      const response = await fetch('http://127.0.0.1:8000/api/user', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if(response.ok){
        const data = await response.json();
        username = data.username || null;
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error validating token:', error);
      return false;
    }
  }

  isAuthenticated = await validateToken();

  const pathname = url.pathname;
  const redirectParam = url.searchParams.get('redirect');
  
  // Only handle redirects in load function if authenticated
  if (isAuthenticated && pathname === '/login') {
    const target = redirectParam || '/account';
    throw redirect(307, target);
  }

  return { isAuthenticated, username };
  
}