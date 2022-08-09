<script lang="ts">
  import Lang from "./Lang.svelte";
  import updaterInfo from "../../Functions/Events/updaterInfo";

  let version: string = "-";

  let checkingForUpdate: boolean = false;
  let updateAvailable: boolean = false;
  let updateNotAvailable: boolean = false;
  let downloading: boolean = false;
  let quitAndInstall: boolean = false;
  let isInstalling: boolean = false;

  let downloadMessage: string = "";

  updaterInfo.requestVersionNumber((data) => {
    version = data.version;
  });

  // globalThis.api.updaterInfo.send("requestVersionNumber", null);

  // globalThis.api.updaterInfo.receive("getVersionNumber", (data) => {
  //   version = data.version;
  // });

  function check() {
    checkingForUpdate = true;
    globalThis.api.updaterInfo.send("checkForUpdate", { version });
  }

  globalThis.api.updaterInfo.receive("checkingForUpdate", (data) => {
    checkingForUpdate = true;
  });

  globalThis.api.updaterInfo.receive("updateAvailable", (data) => {
    checkingForUpdate = false;
    updateAvailable = true;
  });

  globalThis.api.updaterInfo.receive("updateNotAvailable", (data) => {
    checkingForUpdate = false;
    updateAvailable = false;
    updateNotAvailable = true;
  });

  function startDownloadUpdate() {
    globalThis.api.updaterInfo.send("startDownloadUpdate", null);
    updateAvailable = false;
    downloading = true;
  }

  globalThis.api.updaterInfo.receive("downloadProgress", (data) => {
    downloading = true;
    updateAvailable = false;
    let log_message = "Download speed: " + data.bytesPerSecond;
    log_message =
      log_message + " - Downloaded " + data.percent.toFixed(2) + "%";
    log_message =
      log_message +
      " (" +
      data.transferred.toFixed(2) +
      "/" +
      data.total.toFixed(2) +
      ")";
    downloadMessage = log_message;
  });

  globalThis.api.updaterInfo.receive("updateDownloaded", (data) => {
    downloading = false;
    updateAvailable = false;
    quitAndInstall = true;
  });

  function install() {
    globalThis.api.updaterInfo.send("quitAndInstall", null);
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
