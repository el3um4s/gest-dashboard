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
    autoUpdater.checkForUpdates();
  }

  autoUpdater.on.checkingForUpdate({
    callback: () => {
      checkingForUpdate = true;
    },
  });

  autoUpdater.on.updateAvailable({
    callback: (data) => {
      checkingForUpdate = false;
      updateAvailable = true;
    },
  });

  autoUpdater.on.updateNotAvailable({
    callback: (data) => {
      checkingForUpdate = false;
      updateAvailable = false;
      updateNotAvailable = true;
    },
  });

  function startDownloadUpdate() {
    autoUpdater.startDownloadUpdate();
    updateAvailable = false;
    downloading = true;
  }

  autoUpdater.on.downloadProgress({
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
    callback: (data) => {
      downloading = false;
      updateAvailable = false;
      quitAndInstall = true;
    },
  });

  function install() {
    autoUpdater.quitAndInstall();
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

  <div class="message">
    If the installation process doesn't work, download the latest release from <a
      href="https://github.com/el3um4s/gest-dashboard/releases/latest"
      target="_blank">Gest Dashboard - last release</a
    >
  </div>
</div>

<style lang="postcss">
  .message {
    @apply rounded-md text-lg m-1 p-2;
  }

  a {
    @apply underline;
  }
</style>
