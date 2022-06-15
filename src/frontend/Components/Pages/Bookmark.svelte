<script lang="ts">
  import type { HistoryBrowser } from "../../Interfaces/StatusInterface";
  import { Blob } from "blob-polyfill";
  import { saveAs } from "file-saver";

  import { flip } from "svelte/animate";
  import { quintOut } from "svelte/easing";

  import Fa from "svelte-fa";
  import {
    faFolderOpen,
    faStar,
    faGlobe,
    faDownload,
    faUpload,
  } from "@fortawesome/free-solid-svg-icons";
  import { slide } from "svelte/transition";
  import { status } from "../../Stores/Status";

  import CardHistoryBrowser from "../Cards/CardHistoryBrowser.svelte";

  let onlyStarred = false;
  let textSearch = "";
  let showLocalFolders = true;
  let showWebPages = true;

  $: historyBrowser = historyFiltered($status.historyBrowser, {
    onlyStarred,
    textSearch,
    showLocalFolders,
    showWebPages,
  });

  function historyFiltered(
    historyBrowser: HistoryBrowser[],
    settings: {
      onlyStarred: boolean;
      textSearch: string;
      showLocalFolders: boolean;
      showWebPages: boolean;
    }
  ) {
    const { onlyStarred, showLocalFolders, showWebPages } = { ...settings };
    let history = historyBrowser;
    if (onlyStarred) {
      history = history.filter((el) => el.starred == true);
    }

    if (!showLocalFolders) {
      history = history.filter((el) => !el?.folderHandle);
    }

    if (!showWebPages) {
      history = history.filter((el) => !!el?.folderHandle);
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

  let customBookmark;

  $: onFileCustomBookmarkSelected(customBookmark);

  const onFileCustomBookmarkSelected = async (fileList: FileList) => {
    if (fileList) {
      const fileData = fileList[0];
      const text = await fileData.text();
      const newList = JSON.parse(text);
      status.historyBrowserReplaceList(newList);
    }
  };

  // import { testSQLite, loadHistoryBrowser } from "../../Functions/sqlite";

  // globalThis.api.sqlite.receive("loadHistoryBrowser", (data) => {
  //   console.log(data);
  //   let customBookmark = data;
  //   status.historyBrowserReplaceList(customBookmark);
  // });
</script>

<section transition:slide>
  <h1>Bookmarks</h1>
  <div>
    Shown {historyBrowser.length} of {$status.historyBrowser.length}
  </div>
  <div class="tab-component">
    <div class="tab-list">
      <button
        title="Show Local Folder"
        class:selected={showLocalFolders}
        on:click={() => {
          showLocalFolders = !showLocalFolders;
        }}><Fa icon={faFolderOpen} /></button
      >
      <button
        title="Show Web Page"
        class:selected={showWebPages}
        on:click={() => {
          showWebPages = !showWebPages;
        }}><Fa icon={faGlobe} /></button
      >
      <button
        on:click={() => {
          onlyStarred = !onlyStarred;
        }}
        title="Show only Starred"
        class:selected={onlyStarred}><Fa icon={faStar} /></button
      >
      <div>
        <input type="text" bind:value={textSearch} placeholder="Search text" />
      </div>
      <!-- <button
        on:click={() => {
          const jsonString = JSON.stringify($status.historyBrowser);
          const blob = new Blob([jsonString], { type: "application/json" });
          saveAs(blob, "bookmark.json");

          // testSQLite({ historyBrowser: historyBrowser });
        }}
      >
        <Fa icon={faDownload} />
      </button> -->
      <!-- <button
        on:click={() => {
          loadHistoryBrowser();
        }}
      >
        <Fa icon={faUpload} />
      </button> -->

      <button
        title="Download Bookmarks"
        on:click={() => {
          const jsonString = JSON.stringify($status.historyBrowser);
          const blob = new Blob([jsonString], { type: "application/json" });
          saveAs(blob, "bookmark.json");
        }}
      >
        <Fa icon={faDownload} />
      </button>
      <div class="loadCustomBookmark">
        <Fa icon={faUpload} class="iconInputFileBookamrk" />
        <input
          title="Load Custom Bookmark"
          type="file"
          accept=".json"
          bind:files={customBookmark}
          class="inputFileBookamrk"
        />
        <!-- <label title="Load Custom Bookmark" for="input-file-bookamrk"
          ><Fa icon={faUpload} /></label
        > -->
      </div>
    </div>
  </div>

  {#if historyBrowser.length > 0}
    <div class="listHistory">
      <ul>
        {#each historyBrowser as item (item.url)}
          <li animate:flip={{ duration: 250, easing: quintOut }}>
            <CardHistoryBrowser {item} />
          </li>
        {/each}
      </ul>
    </div>
  {/if}
</section>

<style lang="postcss">
  section {
    @apply p-2 h-full flex flex-col;
  }

  .loadCustomBookmark {
    @apply relative flex flex-col h-12;
    background-color: var(--sidebar-background-color);
    color: var(--sidebar-text-color);
    justify-content: center;
    align-items: center;
  }

  .loadCustomBookmark:hover {
    color: var(--sidebar-hover-text-color);
    cursor: pointer;
  }

  .inputFileBookamrk {
    cursor: pointer;
    width: 100%;
    height: 100%;
    opacity: 0;
    position: absolute;
    top: 0;
    left: 0;
  }
</style>
