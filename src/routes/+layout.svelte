<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { browser } from '$app/environment';
  import Header from '../lib/header.svelte';
  import Footer from '../lib/footer.svelte';
  import PreeFooter from '../lib/prefooter.svelte'
  import Prefooter from '../lib/prefooter.svelte';
  import Navigationbar from '../lib/navigationbar.svelte';
  import {authStore} from '../stores/auth';
  import {validateAuth} from '../stores/auth';


  
  
  export let showNavigation = true;

  



</script>
<Header/>

<slot {showNavigation}/>
{#if showNavigation}
<Navigationbar/>
{/if}

<Prefooter/>
<Footer/>

