<script lang="ts">
  let { children } = $props();
  import { innerWidth } from "svelte/reactivity/window";
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";

  let isFirefox = $state(false);
  let showModal = $state(false);

  onMount(() => {
    // Detect Firefox
    isFirefox = navigator.userAgent.toLowerCase().includes("firefox");

    // Check if user has already dismissed the modal
    const dismissed = localStorage.getItem("firefox-modal-dismissed");

    if (isFirefox && !dismissed) {
      showModal = true;
    }
  });

  function dismissModal() {
    showModal = false;
    localStorage.setItem("firefox-modal-dismissed", "true");
  }
</script>

{@render children?.()}

{#if showModal}
  <div class="modal-overlay" transition:fade onclick={dismissModal} onkeydown={(e) => (e.key === "Escape" ? dismissModal() : null)} role="button" tabindex="0" aria-label="Close notification overlay">
    <div class="modal-content" onclick={(e) => e.stopPropagation()} onkeydown={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="modal-title" tabindex="-1">
      <button class="modal-close" onclick={dismissModal} aria-label="Close notification">×</button>
      <p>The card flip animation may not work as intended in some browsers.</p>
      <p>Chromium-based browsers are recommended.</p>
      <button class="modal-button" onclick={dismissModal}>Got it!</button>
    </div>
  </div>
{/if}

<style lang="scss" global>
  @font-face {
    font-family: "Neue-Montreal";
    src: url(/fonts/NeueMontreal-Bold.otf) format("opentype");
    font-weight: bold;
  }

  @font-face {
    font-family: "Neue-Montreal";
    src: url(/fonts/NeueMontreal-Regular.otf) format("opentype");
    font-weight: normal;
  }

  @font-face {
    font-family: "Neue-Montreal";
    src: url(/fonts/NeueMontreal-Italic.otf) format("opentype");
    font-weight: italic;
  }

  :root {
    font-family: "Neue-Montreal", sans-serif;
    font-size: 22px;
    line-height: 24px;
    font-weight: 400;

    color-scheme: light dark;
    color: rgba(255, 255, 255, 0.87);
    background-color: #242424;

    font-synthesis: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-text-size-adjust: 100%;
  }

  :global(body) {
    margin: 0;
    display: flex;
    place-items: center;
    min-width: 320px;
    min-height: 100vh;
    background-color: #e9e3d3;
    color: black;
    overflow: hidden;
    align-items: center;
    flex-direction: column;
    overflow-x: auto;
  }

  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    backdrop-filter: blur(4px);
  }

  .modal-content {
    background: #e9e3d3;
    padding: 2rem;
    border-radius: 1rem;
    max-width: 500px;
    width: 90%;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
    position: relative;
    text-align: center;
    p {
      margin: 0 0 0.5rem 0;
      line-height: 1.5;
      color: #242424;
      font-size: 0.95rem;
    }
  }

  .modal-close {
    position: absolute;
    top: 0.5rem;
    right: 0.75rem;
    background: none;
    border: none;
    font-size: 2rem;
    cursor: pointer;
    color: #242424;
    line-height: 1;
    padding: 0;
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.2s;

    &:hover {
      transform: scale(1.15);
    }
  }

  .modal-button {
    background: #242424;
    color: #e9e3d3;
    border: none;
    padding: 0.75rem 2rem;
    border-radius: 0.5rem;
    font-size: 1rem;
    cursor: pointer;
    font-family: "Neue-Montreal", sans-serif;
    font-weight: bold;
    transition: all 0.3s;

    &:hover {
      transform: translateY(-2px);
    }
  }
</style>
