<script lang="ts">
  import Fa from "svelte-fa";
  import { faPlay, faSpinner } from "@fortawesome/free-solid-svg-icons";
  import { slide } from "svelte/transition";
  import { status } from "../../Stores/Status";

  let src = $status.urlBrowser;
  let showSpinner = false;

  import { onMount } from "svelte";

  onMount(() => {
    showSpinner = false;
  });
</script>

<section transition:slide>
  <h1>Open Web Page</h1>

  <div>
    <input type="url" bind:value={src} placeholder="https://example.com" />
    <button
      on:click={async () => {
        showSpinner = true;
        await globalThis.api.windowManager.send("openInBrowserView", {
          src,
        });
        await globalThis.api.windowManager.send("showBrowserView", {
          show: true,
        });
        await status.urlBrowser(src);
      }}
    >
      {#if showSpinner}
        <Fa icon={faSpinner} spin />
      {:else}
        <Fa icon={faPlay} />
      {/if}
    </button>
  </div>
</section>

<style lang="postcss">
  section {
    @apply p-2;
  }
  div {
    @apply m-4;
  }
  input {
    width: calc(100% - 64px);
  }
</style>
