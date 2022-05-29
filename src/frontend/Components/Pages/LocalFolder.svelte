<script lang="ts">
  import { tick } from "svelte";

  import { FolderHandle } from "../../sw/folderHandler";
  import type { HistoryBrowser } from "../../Interfaces/StatusInterface";

  import { flip } from "svelte/animate";
  import { quintOut } from "svelte/easing";

  import Fa from "svelte-fa";
  import {
    faFolderOpen,
    faPlay,
    faStar,
  } from "@fortawesome/free-solid-svg-icons";
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

  async function loadFolder(e) {
    const item = e.dataTransfer.items[0];
    console.log(e.dataTransfer.files[0].path);

    if (item.kind === "file") {
      const entry = await item.getAsFileSystemHandle();
      if (entry.kind === "directory") {
        status.folderHandle(null);
        tick();
        status.componentVisible(LoadingPage);
        await globalThis.api.windowManager.send("showBrowserView", {
          show: true,
        });

        status.folderHandle(await FolderHandle.reInit(entry));
      }
    }
  }

  const noHistory = false;
  let isDragOver = false;
</script>

<section transition:slide>
  <h1>Open Local Folder</h1>

  <div>
    <div class="chooseFolder" class:isDragOver>
      <Fa icon={faFolderOpen} />
      <div>Drag'n'Drop Folder</div>
      <input
        type="file"
        class="inputfile"
        on:drop={async (e) => {
          console.log("dropped");
          isDragOver = false;
          await loadFolder(e);
        }}
        on:click|preventDefault={() =>
          console.log("Function disabled. Drop folders!")}
        on:dragenter={() => (isDragOver = true)}
        on:dragover={() => (isDragOver = true)}
        on:dragend={() => (isDragOver = false)}
        on:dragleave={() => (isDragOver = false)}
      />

      {#if noHistory}
        <button
          on:click={async () => {
            status.folderHandle(null);
            tick();
            status.folderHandle(await FolderHandle.init($status.sw.hostName));
          }}
          ><Fa icon={faFolderOpen} /> Choose Folder
        </button>
      {/if}
    </div>
  </div>
  <!-- <div class="filterBar">
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
  </div> -->
</section>

<style lang="postcss">
  section {
    @apply p-2 h-full flex flex-col;
  }

  .chooseFolder {
    @apply p-2 relative flex flex-col h-32 border-4 border-dotted m-2;
    width: calc(100% - 64px);
    background-color: var(--sidebar-background-color);
    color: var(--sidebar-text-color);
    border-color: var(--sidebar-border-color);
    justify-content: center;
    align-items: center;
    font-size: xx-large;
  }

  .chooseFolder:hover {
    color: var(--sidebar-hover-text-color);
    border-color: var(--sidebar-hover-text-color);
  }

  .isDragOver {
    background-color: var(--sidebar-text-color);
    color: var(--sidebar-background-color);
  }
  .inputfile {
    width: 100%;
    height: 100%;
    opacity: 0;
    position: absolute;
    top: 0;
    left: 0;
    /* z-index: -1; */
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
