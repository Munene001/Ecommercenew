<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { browser } from '$app/environment';
  import Header from '../lib/header.svelte';
  import Footer from '../lib/footer.svelte';
  import PreeFooter from '../lib/prefooter.svelte'
  import Prefooter from '../lib/prefooter.svelte';
  import Navigationbar from '../lib/navigationbar.svelte'

  export let data; // Receive isAuthenticated from load
  let isAuthenticated = data.isAuthenticated;
</script>
<Header isAuthenticated={data.isAuthenticated} username={data.username} />

<slot />
<Navigationbar/>
<Prefooter/>
<Footer/>

