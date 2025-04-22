import {writable} from 'svelte/store';
import { browser } from '$app/environment';

export const authStore = writable({
    isAuthenticated: false,
    username:null,
    token:null,
    isLoading: true
});
export async function validateAuth(){
  if(!browser){
    authStore.set({isAuthenticated: false, username:null, token : null,isLoading:false});
    return;
  }
  const token = localStorage.getItem('authToken') || '';
  let isAuthenticated = false;
  let username = null;

  if(token){
    try {
        const response = await fetch(`http://127.0.0.1:8000/api/user`,{
            headers :{
                Authorization: `Bearer ${token}`,
                'Content-Type' : 'application/json'
            }
        });
        if (response.ok){
          
            const data = await response.json();
            console.log('API /api/user response:', data);
            isAuthenticated = true;
            username = data.username || null;
        }
        
    } catch (error) {
        console.error('Error validating token:', error);
        
    }
  }
  authStore.set({isAuthenticated, username, isLoading: false});
}
export function initializeAuth(token, username){
    localStorage.setItem('authToken', token);
    authStore.set({isAuthenticated: !!token, username, isLoading:false});
}
export function clearAuth(){
    localStorage.removeItem('authToken');
    authStore.set({isAuthenticated: false, username: null, isLoading: false})
}
validateAuth();

