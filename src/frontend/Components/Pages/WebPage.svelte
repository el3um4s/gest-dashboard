<script lang="ts">
  import Fa from "svelte-fa";
  import { faPlay, faSpinner } from "@fortawesome/free-solid-svg-icons";
  import { slide } from "svelte/transition";
  import { status } from "../../Stores/Status";

  import CardHistoryBrowser from "../Cards/CardHistoryBrowser.svelte";

  let src = $status.urlBrowser;
  let showSpinner = false;

  import { onMount } from "svelte";

  onMount(() => {
    showSpinner = false;
  });

  const openWebPage = async (url: string) => {
    showSpinner = true;
    await globalThis.api.windowManager.send("openInBrowserView", {
      src,
    });
    await globalThis.api.windowManager.send("showBrowserView", {
      show: true,
    });
    await status.urlBrowser(url);
    status.historyBrowserAddNew({ url: url, title: "", note: "" });
  };
</script>

<section transition:slide>
  <h1>Open Web Page</h1>

  <div>
    <input type="url" bind:value={src} placeholder="https://example.com" />
    <button
      on:click={async () => {
        openWebPage(src);
      }}
    >
      {#if showSpinner}
        <Fa icon={faSpinner} spin />
      {:else}
        <Fa icon={faPlay} />
      {/if}
    </button>
  </div>
  <div>
    <h3>History</h3>
    <ul>
      {#each $status.historyBrowser as item}
        <li><CardHistoryBrowser {item} /></li>
      {/each}
    </ul>
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
