<script lang="ts">
  import { tick } from "svelte";

  import { FolderHandle } from "../../sw/folderHandler";

  import Fa from "svelte-fa";
  import { faFolderOpen, faPlay } from "@fortawesome/free-solid-svg-icons";

  import { slide } from "svelte/transition";
  import { status } from "../../Stores/Status";

  import LoadingPage from "./LoadingPage.svelte";
  import Lang from "../Default/Lang.svelte";

  let src = $status.urlBrowser;

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

        await globalThis.api.chokidarAPI.send("watchFolder", {
          nameWatcher: "gestDashboard",
          folderPath: url,
        });

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
  <h1><Lang c="loadLocalFolder" v="title" /></h1>

  <div class="tab-component">
    <div class="tab-list">
      <button
        on:click={() => (tabActive = "localFolder")}
        class:selected={tabActive === "localFolder"}
        ><Lang c="loadLocalFolder" v="openLocalFolder" /></button
      >
      <button
        on:click={() => (tabActive = "webPage")}
        class:selected={tabActive === "webPage"}
        ><Lang c="loadLocalFolder" v="openWebPage" /></button
      >
    </div>
    <div class="tab-panel">
      {#if tabActive == "localFolder"}
        <div class="chooseFolder" class:isDragOver transition:slide>
          <Fa icon={faFolderOpen} />
          <div><Lang c="loadLocalFolder" v="Drag'n'Drop Folder" /></div>
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
</style>
