<script>
  import { onMount } from 'svelte';
  
  let showBanner = true;
  
  onMount(() => {
    console.log('SimpleCookieConsent mounted!');
  });
  
  function acceptCookies() {
    showBanner = false;
    localStorage.setItem('cookie-consent', JSON.stringify({ accepted: true }));
  }
</script>

{#if showBanner}
  <div class="fixed bottom-0 left-0 right-0 z-[9999] bg-blue-600 text-white p-4"
       style="z-index: 9999;">
    <div class="max-w-4xl mx-auto flex items-center justify-between">
      <p>Diese Website verwendet Cookies. Durch die Nutzung stimmen Sie zu.</p>
      <button 
        on:click={acceptCookies}
        class="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-100"
      >
        Akzeptieren
      </button>
    </div>
  </div>
{/if}
