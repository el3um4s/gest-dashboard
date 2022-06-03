<script lang="ts">
  import { tick } from "svelte";
  import { slide } from "svelte/transition";

  import { FolderHandle } from "../../sw/folderHandler";

  import type { HistoryBrowser } from "../../Interfaces/StatusInterface";
  import { status } from "../../Stores/Status";

  import Fa from "svelte-fa";
  import {
    faPlay,
    faTrash,
    faPen,
    faStar,
    faCircleCheck,
  } from "@fortawesome/free-solid-svg-icons";
  import { faStar as faStarLight } from "@fortawesome/free-regular-svg-icons";

  import LoadingPage from "../Pages/LoadingPage.svelte";

  export let item: HistoryBrowser;
  let editing: boolean = false;

  let url = item?.url ? item.url : "https://example.com";
  let title = item?.title ? item.title : "";
  let note = item?.note ? item.note : "";
  let folderHandle = item?.folderHandle ? item.folderHandle : undefined;

  $: starred = item?.starred ? item.starred : false;

  const openWebPage = async (url: string) => {
    status.componentVisible(LoadingPage);
    editing = false;
    await globalThis.api.windowManager.send("openInBrowserView", {
      src: url,
    });
    await globalThis.api.windowManager.send("showBrowserView", {
      show: true,
    });
    await status.urlBrowser(url);
    status.browserStarted(true);
    status.historyBrowserAddNew({ url, title, note, starred });
  };

  const openFolderHandle = async (folderHandle: FileSystemDirectoryHandle) => {
    editing = false;
    status.folderHandle(null);
    await tick();
    status.componentVisible(LoadingPage);
    await globalThis.api.windowManager.send("showBrowserView", {
      show: true,
    });
    const hostName = $status.sw.hostName;
    await folderHandle.requestPermission({
      mode: "read",
    });

    const fh = await FolderHandle.reInit(folderHandle, hostName);
    status.folderHandle(fh);
  };

  const titleLink = (title: string, url: string): string => {
    return title.trim() == ""
      ? new URL(url).hostname.replace("www.", "")
      : title.trim();
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
        console.log(folderHandle);
        if (folderHandle) {
          openFolderHandle(folderHandle);
        } else {
          openWebPage(url);
        }
      }}
    >
      <Fa icon={faPlay} />
    </button>
    {#if editing}
      <input
        bind:value={title}
        placeholder={titleLink(title, url)}
        on:click={() => {
          title = titleLink(title, url);
        }}
        on:change={() => {
          status.historyBrowserSetTitle(item, title);
        }}
        transition:slide
      />
    {:else}
      <button
        class="link"
        title="Open Page ({url})"
        on:click={async () => {
          console.log(folderHandle);
          if (folderHandle) {
            openFolderHandle(folderHandle);
          } else {
            openWebPage(url);
          }
        }}
        transition:slide
      >
        {titleLink(title, url)}
      </button>
    {/if}
  </div>

  <div class="note">
    <button
      class="link"
      title="Open Page ({url})"
      on:click={async () => {
        console.log(folderHandle);
        if (folderHandle) {
          openFolderHandle(folderHandle);
        } else {
          openWebPage(url);
        }
      }}
    >
      {item.url}
    </button>
    {#if editing}
      <input
        bind:value={note}
        placeholder="note"
        on:change={() => {
          status.historyBrowserSetNote(item, note);
        }}
        transition:slide
      />
    {:else if note.trim() != ""}
      <div transition:slide>
        {note}
      </div>
    {/if}
  </div>

  <div class="actions">
    <button
      title="Edit Note and Title"
      on:click={() => {
        editing = !editing;
      }}
    >
      <Fa icon={editing ? faCircleCheck : faPen} />
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
