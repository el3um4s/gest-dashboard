<script lang="ts">
  import Lang from "./Lang.svelte";
  import autoUpdater from "@el3um4s/renderer-for-electron-auto-updater";

  let checkingForUpdate: boolean = false;
  let updateAvailable: boolean = false;
  let updateNotAvailable: boolean = false;
  let downloading: boolean = false;
  let quitAndInstall: boolean = false;
  let isInstalling: boolean = false;

  let downloadMessage: string = "";

  function check() {
    checkingForUpdate = true;
    autoUpdater.checkForUpdates({
      apiKey: "api",
    });
  }

  autoUpdater.on.checkingForUpdate({
    apiKey: "api",
    callback: () => {
      checkingForUpdate = true;
    },
  });

  autoUpdater.on.updateAvailable({
    apiKey: "api",
    callback: (data) => {
      checkingForUpdate = false;
      updateAvailable = true;
    },
  });

  autoUpdater.on.updateNotAvailable({
    apiKey: "api",
    callback: (data) => {
      checkingForUpdate = false;
      updateAvailable = false;
      updateNotAvailable = true;
    },
  });

  function startDownloadUpdate() {
    autoUpdater.startDownloadUpdate({
      apiKey: "api",
    });
    updateAvailable = false;
    downloading = true;
  }

  autoUpdater.on.downloadProgress({
    apiKey: "api",
    callback: (data) => {
      downloading = true;
      updateAvailable = false;

      const bytesPerSecond = data.bytesPerSecond;
      const percent = data.percent.toFixed(2);
      const transferred = data.transferred.toFixed(2);
      const total = data.total.toFixed(2);
      const log_message = `Download: ${bytesPerSecond} bytes/sec, ${percent}% (${transferred}/${total})`;

      downloadMessage = log_message;
    },
  });

  autoUpdater.on.updateDownloaded({
    apiKey: "api",
    callback: (data) => {
      downloading = false;
      updateAvailable = false;
      quitAndInstall = true;
    },
  });

  function install() {
    autoUpdater.quitAndInstall({
      apiKey: "api",
    });
    quitAndInstall = false;
    isInstalling = true;
  }
</script>

<div>
  {#if !checkingForUpdate && !updateAvailable && !downloading && !quitAndInstall && !isInstalling}
    <button class="button-action" on:click={check}
      ><Lang c="checkForUpdate" v="checkForUpdate" /></button
    >
  {/if}
  {#if checkingForUpdate}
    <span class="message">
      <Lang c="checkForUpdate" v="checkingForUpdate" />
    </span>
  {/if}
  {#if updateAvailable}
    <button class="button-action" on:click={startDownloadUpdate}
      ><Lang c="checkForUpdate" v="updatesAvailable" /></button
    >
  {/if}
  {#if updateNotAvailable && !checkingForUpdate}
    <span class="message"
      ><Lang c="checkForUpdate" v="updateNotAvailable" /></span
    >
  {/if}
  {#if downloading}
    <span class="message">
      {downloadMessage.length > 1 ? downloadMessage : "download..."}
    </span>
  {/if}
  {#if quitAndInstall}
    <button class="button-action" on:click={install}
      ><Lang c="checkForUpdate" v="updatesReady" /></button
    >
  {/if}
  {#if isInstalling}
    <span class="message"><Lang c="checkForUpdate" v="installing" /></span>
  {/if}
</div>

<style lang="postcss">
  .message {
    @apply rounded-md text-lg m-1 p-2;
  }
</style>
