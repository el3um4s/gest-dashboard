<script lang="ts">
  import type { HistoryBrowser } from "../../Interfaces/StatusInterface";

  import { flip } from "svelte/animate";
  import { quintOut } from "svelte/easing";

  import Fa from "svelte-fa";
  import {
    faFolderOpen,
    faStar,
    faGlobe,
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
      <input type="text" bind:value={textSearch} placeholder="Search text" />
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
</style>
