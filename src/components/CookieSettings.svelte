<script lang="ts">
  import { onMount } from 'svelte';
  
  let showModal = false;
  let hasConsent = false;
  
  // Cookie consent preferences
  let preferences = {
    essential: true,
    analytics: false,
    functional: false,
    marketing: false
  };

  onMount(() => {
    // Check if user has cookie consent stored
    const consent = localStorage.getItem('cookie-consent');
    if (consent) {
      hasConsent = true;
      try {
        preferences = { ...preferences, ...JSON.parse(consent) };
      } catch (e) {
        console.error('Error parsing cookie consent:', e);
      }
    }
  });

  function openModal() {
    showModal = true;
  }

  function closeModal() {
    showModal = false;
  }

  function savePreferences() {
    localStorage.setItem('cookie-consent', JSON.stringify(preferences));
    
    // Trigger custom event for other scripts to listen to
    window.dispatchEvent(new CustomEvent('cookieConsentUpdated', { 
      detail: preferences 
    }));
    
    closeModal();
  }

  function resetPreferences() {
    localStorage.removeItem('cookie-consent');
    preferences = {
      essential: true,
      analytics: false,
      functional: false,
      marketing: false
    };
    hasConsent = false;
    closeModal();
    
    // Trigger page reload to show cookie banner again
    window.location.reload();
  }
</script>

<button
  on:click={openModal}
  class="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-[#a98bde] dark:hover:text-[#a98bde] transition-colors duration-200 text-sm font-medium hover:scale-105 transform"
  title="Cookie-Einstellungen verwalten"
>
  <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 12c.5-1 1.5-2 2.5-2s2 1 2 2-1 2-2 2-2-1-2-2z"/>
    <path d="M12 12c-.5-1-1.5-2-2.5-2S7.5 11 7.5 12s1 2 2 2 2-1 2-2z"/>
    <circle cx="12" cy="12" r="10"/>
    <path d="M8 12c0-.5.5-1 1-1s1 .5 1 1-.5 1-1 1-1-.5-1-1z"/>
    <path d="M14 12c0-.5.5-1 1-1s1 .5 1 1-.5 1-1 1-1-.5-1-1z"/>
    <path d="m9 20 6-8"/>
  </svg>
  Cookie-Einstellungen
</button>

{#if showModal}
  <!-- Settings Modal -->
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <!-- Backdrop -->
    <div 
      class="absolute inset-0 bg-black bg-opacity-50" 
      on:click={closeModal}
      on:keydown={(e) => e.key === 'Escape' && closeModal()}
      role="button"
      tabindex="0"
      aria-label="Schließen"
    ></div>
    
    <!-- Modal -->
    <div class="relative bg-white dark:bg-[#2a2531] rounded-lg shadow-xl dark:shadow-black/30 max-w-2xl w-full max-h-[90vh] overflow-y-auto border dark:border-[#a98bde]/30">
      <div class="p-6">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-[#a98bde]">
            Cookie-Einstellungen
          </h2>
          <button
            on:click={closeModal}
            class="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-[#a98bde]"
            aria-label="Schließen"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <!-- Current Status -->
        {#if hasConsent}
        <div class="mb-6 p-4 bg-gray-50 dark:bg-[#2a2531] rounded-lg border dark:border-[#a98bde]/30">
          <h3 class="font-medium text-gray-900 dark:text-[#a98bde] mb-2">Aktuelle Einstellungen</h3>
          <div class="grid grid-cols-2 gap-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-700 dark:text-gray-300">Erforderlich:</span>
              <span class="font-medium text-green-600 dark:text-green-400">Aktiv</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-700 dark:text-gray-300">Analyse:</span>
              <span class="font-medium {preferences.analytics ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}">
                {preferences.analytics ? 'Aktiv' : 'Inaktiv'}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-700 dark:text-gray-300">Funktional:</span>
              <span class="font-medium {preferences.functional ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}">
                {preferences.functional ? 'Aktiv' : 'Inaktiv'}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-700 dark:text-gray-300">Marketing:</span>
              <span class="font-medium {preferences.marketing ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}">
                {preferences.marketing ? 'Aktiv' : 'Inaktiv'}
              </span>
            </div>
          </div>
        </div>
        {:else}
        <div class="mb-6 p-4 bg-yellow-50 dark:bg-[#2a2531] rounded-lg border dark:border-[#a98bde]/30">
          <h3 class="font-medium text-yellow-900 dark:text-[#a98bde] mb-2">Keine Einstellungen gespeichert</h3>
          <p class="text-sm text-yellow-800 dark:text-gray-300">
            Sie haben noch keine Cookie-Einstellungen festgelegt. Bitte wählen Sie Ihre Präferenzen unten aus.
          </p>
        </div>
        {/if}
        
        <!-- Cookie Categories -->
        <div class="space-y-6">
          <!-- Essential Cookies -->
          <div class="border-b border-gray-200 dark:border-[#a98bde]/30 pb-4">
            <div class="flex items-center justify-between mb-2">
              <h3 class="font-medium text-gray-900 dark:text-[#a98bde]">Erforderliche Cookies</h3>
              <div class="flex items-center">
                <input
                  type="checkbox"
                  id="essential-settings"
                  bind:checked={preferences.essential}
                  disabled
                  class="w-4 h-4 text-[#a98bde] dark:text-[#a98bde] bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-[#a98bde]/50 rounded focus:ring-[#a98bde] dark:focus:ring-[#a98bde]"
                />
                <label for="essential-settings" class="ml-2 text-sm text-gray-600 dark:text-gray-300">Immer aktiv</label>
              </div>
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-300">
              Diese Cookies sind für das Funktionieren der Website erforderlich und können nicht deaktiviert werden.
            </p>
          </div>
          
          <!-- Analytics Cookies -->
          <div class="border-b border-gray-200 dark:border-[#a98bde]/30 pb-4">
            <div class="flex items-center justify-between mb-2">
              <h3 class="font-medium text-gray-900 dark:text-[#a98bde]">Analyse-Cookies</h3>
              <div class="flex items-center">
                <input
                  type="checkbox"
                  id="analytics-settings"
                  bind:checked={preferences.analytics}
                  class="w-4 h-4 text-[#a98bde] dark:text-[#a98bde] bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-[#a98bde]/50 rounded focus:ring-[#a98bde] dark:focus:ring-[#a98bde]"
                />
                <label for="analytics-settings" class="ml-2 text-sm text-gray-600 dark:text-gray-300">
                  {preferences.analytics ? 'Aktiviert' : 'Deaktiviert'}
                </label>
              </div>
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-300">
              Diese Cookies helfen uns zu verstehen, wie Besucher mit der Website interagieren (Umami Analytics).
            </p>
          </div>
          
          <!-- Functional Cookies -->
          <div class="border-b border-gray-200 dark:border-[#a98bde]/30 pb-4">
            <div class="flex items-center justify-between mb-2">
              <h3 class="font-medium text-gray-900 dark:text-[#a98bde]">Funktionale Cookies</h3>
              <div class="flex items-center">
                <input
                  type="checkbox"
                  id="functional-settings"
                  bind:checked={preferences.functional}
                  class="w-4 h-4 text-[#a98bde] dark:text-[#a98bde] bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-[#a98bde]/50 rounded focus:ring-[#a98bde] dark:focus:ring-[#a98bde]"
                />
                <label for="functional-settings" class="ml-2 text-sm text-gray-600 dark:text-gray-300">
                  {preferences.functional ? 'Aktiviert' : 'Deaktiviert'}
                </label>
              </div>
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-300">
              Diese Cookies ermöglichen erweiterte Funktionalität und Personalisierung.
            </p>
          </div>
          
          <!-- Marketing Cookies -->
          <div class="pb-4">
            <div class="flex items-center justify-between mb-2">
              <h3 class="font-medium text-gray-900 dark:text-[#a98bde]">Marketing-Cookies</h3>
              <div class="flex items-center">
                <input
                  type="checkbox"
                  id="marketing-settings"
                  bind:checked={preferences.marketing}
                  class="w-4 h-4 text-[#a98bde] dark:text-[#a98bde] bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-[#a98bde]/50 rounded focus:ring-[#a98bde] dark:focus:ring-[#a98bde]"
                />
                <label for="marketing-settings" class="ml-2 text-sm text-gray-600 dark:text-gray-300">
                  {preferences.marketing ? 'Aktiviert' : 'Deaktiviert'}
                </label>
              </div>
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-300">
              Diese Cookies werden für Marketing und Werbezwecke verwendet.
            </p>
          </div>
        </div>
        
        <!-- Actions -->
        <div class="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200 dark:border-[#a98bde]/30">
          <button
            on:click={resetPreferences}
            class="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-transparent border border-red-300 dark:border-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
          >
            Alle zurücksetzen
          </button>
          <div class="flex-1"></div>
          <button
            on:click={closeModal}
            class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-transparent border border-gray-300 dark:border-[#a98bde]/50 rounded-lg hover:bg-gray-50 dark:hover:bg-[#a98bde]/10 dark:hover:border-[#a98bde] transition-colors duration-200"
          >
            Abbrechen
          </button>
          <button
            on:click={savePreferences}
            class="px-6 py-2 text-sm font-medium text-white bg-[#a98bde] dark:bg-[#a98bde] rounded-lg hover:bg-[#9b7dd9] dark:hover:bg-[#9b7dd9] transition-colors duration-200 focus:ring-4 focus:ring-[#a98bde]/50 dark:focus:ring-[#a98bde]/50"
          >
            Speichern
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}
