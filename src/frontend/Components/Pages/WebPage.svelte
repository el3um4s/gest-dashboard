<script lang="ts">
  import type { HistoryBrowser } from "../../Interfaces/StatusInterface";

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
  let textSearch = "";

  $: historyBrowser = historyFiltered($status.historyBrowser, {
    onlyStarred,
    textSearch,
  });

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

  function historyFiltered(
    historyBrowser: HistoryBrowser[],
    settings: { onlyStarred: boolean; textSearch: string }
  ) {
    const { onlyStarred } = { ...settings };
    let history = historyBrowser;
    if (onlyStarred) {
      history = history.filter((el) => el.starred == true);
    }

    if (textSearch.trim() != "") {
      history = history.filter(
        (el) =>
          el.note.includes(textSearch) ||
          el.title.includes(textSearch) ||
          el.url.includes(textSearch)
      );
    }
    return history;
  }
</script>

<section transition:slide>
  <h1>Open Web Page</h1>

  <div>
    <input
      class="inputUrl"
      type="url"
      bind:value={src}
      placeholder="https://example.com"
    />
    <button
      on:click={async () => {
        openWebPage(src);
      }}
    >
      <Fa icon={faPlay} />
    </button>
  </div>
  <div class="filterBar">
    <div>Shown {historyBrowser.length} of {$status.historyBrowser.length}</div>
    <div>
      <input type="text" bind:value={textSearch} placeholder="Search text" />
    </div>
    <div>
      <button
        on:click={() => {
          onlyStarred = !onlyStarred;
        }}
        title="Show only Starred"
        ><Fa icon={onlyStarred ? faStar : faStarLight} /></button
      >
    </div>
  </div>
  <div class="listHistory">
    <ul>
      {#each historyBrowser as item (item.url)}
        <li animate:flip={{ duration: 250, easing: quintOut }}>
          <CardHistoryBrowser {item} />
        </li>
      {/each}
    </ul>
  </div>
</section>

<style lang="postcss">
  section {
    @apply p-2 h-full flex flex-col;
  }

  .inputUrl {
    width: calc(100% - 64px);
  }

  .filterBar {
    @apply flex flex-row p-2 gap-2 items-center;
  }

  .listHistory {
    @apply h-full;
    overflow-y: overlay;
    overflow-x: hidden;
  }

  ul {
    width: calc(100% - 16px);
  }

  .listHistory::-webkit-scrollbar {
    @apply w-4;
  }

  .listHistory::-webkit-scrollbar-track {
    border: 2px solid var(--background-color);
    border-left: 8px solid var(--background-color);
    background-color: var(--background-color);
  }

  .listHistory::-webkit-scrollbar-thumb {
    background-color: var(--hover-scrollbar-thumb);
    border-left: 8px solid var(--background-color);
  }
</style>
