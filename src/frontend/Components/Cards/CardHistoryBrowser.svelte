<script lang="ts">
  import type { HistoryBrowser } from "../../Interfaces/StatusInterface";
  import { status } from "../../Stores/Status";

  import Fa from "svelte-fa";
  import {
    faPlay,
    faTrash,
    faPen,
    faStar,
  } from "@fortawesome/free-solid-svg-icons";
  import { faStar as faStarLight } from "@fortawesome/free-regular-svg-icons";

  export let item: HistoryBrowser;

  $: url = item?.url ? item.url : "https://example.com";
  $: title = item?.title ? item.title : "";
  $: note = item?.note ? item.note : "";
  $: starred = item?.starred ? item.starred : false;

  const openWebPage = async (url: string) => {
    await globalThis.api.windowManager.send("openInBrowserView", {
      src: url,
    });
    await globalThis.api.windowManager.send("showBrowserView", {
      show: true,
    });
    await status.urlBrowser(url);
    status.historyBrowserAddNew({ url, title, note, starred });
  };
</script>

<section class="card">
  <div class="header">
    <button
      title="Star this page"
      on:click={() => {
        status.historyBrowserSetStarred(item, !starred);
      }}
    >
      {#if starred}
        <Fa icon={faStar} />
      {:else}
        <Fa icon={faStarLight} />
      {/if}
    </button>
    <button
      title="Open Page ({url})"
      on:click={async () => {
        openWebPage(url);
      }}
    >
      <Fa icon={faPlay} />
    </button>
    <button
      class="link"
      title="Open Page ({url})"
      on:click={async () => {
        openWebPage(url);
      }}
    >
      Title
    </button>
  </div>

  <div class="note">
    <button
      class="link"
      title="Open Page ({url})"
      on:click={async () => {
        openWebPage(url);
      }}
    >
      {item.url}
    </button>
    {#if note != ""}
      <div>
        Note: {note}
      </div>
    {/if}
  </div>

  <div class="actions">
    <button title="Edit Note and Title">
      <Fa icon={faPen} />
    </button>
    <button
      title="Delete Page"
      on:click={async () => {
        status.historyBrowserDeleteItem(item);
      }}
    >
      <Fa icon={faTrash} />
    </button>
  </div>
</section>

<style lang="postcss">
</style>
