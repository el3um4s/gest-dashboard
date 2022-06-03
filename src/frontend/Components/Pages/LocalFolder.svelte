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
    const url = e.dataTransfer.files[0].path;

    if (item.kind === "file") {
      const entry = await item.getAsFileSystemHandle();
      if (entry.kind === "directory") {
        status.folderHandle(null);
        await tick();
        status.componentVisible(LoadingPage);
        await globalThis.api.windowManager.send("showBrowserView", {
          show: true,
        });
        const hostName = $status.sw.hostName;
        const folderHandle = await FolderHandle.reInit(entry, hostName);
        status.folderHandle(folderHandle);

        status.historyBrowserAddNew({
          url: url,
          title: $status.folderName,
          note: "",
          starred: false,
          folderHandle: folderHandle,
        });
      }
    }
  }

  const noHistory = false;
  let isDragOver = false;
  let tabActive = "localFolder";
</script>

<section transition:slide>
  <h1>Open</h1>

  <div class="tab-component">
    <div class="tab-list">
      <button
        on:click={() => (tabActive = "localFolder")}
        class:selected={tabActive === "localFolder"}>Local Folder</button
      >
      <button
        on:click={() => (tabActive = "webPage")}
        class:selected={tabActive === "webPage"}>Web Page</button
      >
    </div>
    <div class="tab-panel">
      {#if tabActive == "localFolder"}
        <div class="chooseFolder" class:isDragOver transition:slide>
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
                status.folderHandle(
                  await FolderHandle.init($status.sw.hostName)
                );
              }}
              ><Fa icon={faFolderOpen} /> Choose Folder
            </button>
          {/if}
        </div>
      {:else}
        <div class="chooseUrl" transition:slide>
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
      {/if}
    </div>
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

  .chooseFolder {
    @apply p-2 relative flex flex-col h-32 border-4 border-dotted m-2;
    width: calc(100% - 1rem);
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
  }

  .chooseUrl {
    @apply p-2 relative flex flex-row h-16 border-4 border-dotted m-2;
    width: calc(100% - 1rem);
  }

  .inputUrl {
    @apply p-1;
    width: calc(100% - 64px);
  }

  .filterBar {
    @apply flex flex-row p-2 gap-2 items-center;
  }

  .listHistory {
    @apply h-full border;
    border-radius: 0 0 0.25rem 0.25rem;
    border-color: var(--sidebar-text-color);
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
