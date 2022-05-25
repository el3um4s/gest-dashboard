<script lang="ts">
  import { flip } from "svelte/animate";
  import { quintOut } from "svelte/easing";

  import Fa from "svelte-fa";
  import { faPlay, faStar } from "@fortawesome/free-solid-svg-icons";
  import { faStar as faStarLight } from "@fortawesome/free-regular-svg-icons";
  import { slide } from "svelte/transition";
  import { status } from "../../Stores/Status";

  import CardHistoryBrowser from "../Cards/CardHistoryBrowser.svelte";
  import LoadingPage from "./LoadingPage.svelte";

  let src = $status.urlBrowser;
  let onlyStarred = false;

  const openWebPage = async (url: string) => {
    status.componentVisible(LoadingPage);
    await globalThis.api.windowManager.send("openInBrowserView", {
      src,
    });
    await globalThis.api.windowManager.send("showBrowserView", {
      show: true,
    });
    await status.urlBrowser(url);
    status.browserStarted(true);
    status.historyBrowserAddNew({
      url: url,
      title: "",
      note: "",
      starred: false,
    });
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
      <Fa icon={faPlay} />
    </button>
  </div>
  <div>
    <div>
      <button
        on:click={() => {
          onlyStarred = !onlyStarred;
        }}
        title="Show only Starred"
        ><Fa icon={onlyStarred ? faStar : faStarLight} /></button
      >
    </div>
    <ul>
      {#each $status.historyBrowser as item (item.url)}
        <li animate:flip={{ duration: 250, easing: quintOut }}>
          {#if onlyStarred && item.starred}
            <CardHistoryBrowser {item} />
          {:else if !onlyStarred}
            <CardHistoryBrowser {item} />
          {/if}
        </li>
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
