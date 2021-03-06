<script lang="ts">
  import "./css/tailwind.pcss";

  import { onMount } from "svelte";
  import { tick } from "svelte";

  import { status } from "./Stores/Status";

  import { SW } from "./sw/serviceWorker";
  import { handleFetch } from "./sw/fetchHandler";

  import GlobalThisAPI from "./Components/Default/GlobalThisAPI.svelte";
  import MainWithTitlebar from "./Components/Default/MainWithTitlebar.svelte";
  import StatusBar from "./Components/Default/StatusBar.svelte";
  import LeftBar from "./Components/Default/LeftBar.svelte";
  import RightBar from "./Components/Default/RightBar.svelte";

  import { idbSettings } from "./IndexedDB/Settings";

  import languages from "./Languages/Languages";
  let lang: "en" | "it" = "en";

  onMount(async () => {
    await SW.register();

    lang = await idbSettings.getLang("en");
    await status.lang(lang);

    const showIndexHtmlImmediately =
      await idbSettings.getShowIndexHtmlImmediately(true);
    await status.showIndexHtmlImmediately(showIndexHtmlImmediately);

    const reloadWhenFolderChange = await idbSettings.getReloadWhenFolderChange(
      "no"
    );
    await status.reloadWhenFolderChange(reloadWhenFolderChange);

    const urlBrowser = await idbSettings.getURLBrowser(
      "http://www.example.com"
    );
    await status.urlBrowser(urlBrowser);

    const historyBrowser = await idbSettings.getHistoryBrowser();
    await status.historyBrowser(historyBrowser);
  });

  window.addEventListener("unload", () => {
    SW.post({
      type: "host-stop",
      hostName: $status.sw.hostName,
    });
  });

  // Handle messages from SW
  navigator.serviceWorker.addEventListener("message", async (e) => {
    switch (e.data.type) {
      case "start-ok":
        await onHostStarted(e.data);
        break;
      case "fetch":
        handleFetch(
          $status.sw.folderHandle,
          $status.showIndexHtmlImmediately,
          e
        );
        break;
      default:
        console.warn(`Unknown message from SW '${e.data.type}'`);
        break;
    }
  });

  // SW indicates hosting started OK: get info and display URL
  async function onHostStarted(data) {
    status.hostName("");
    status.swScope(null);
    status.clientId("");
    await tick();
    status.hostName(data.hostName);
    status.swScope(data.scope);
    status.clientId(data.clientId);
    await tick();

    const link = $status.sw.swScope
      ? `${$status.sw.swScope}${$status.sw.hostName}/`
      : null;
    globalThis.api.windowManager.send("openInBrowserView", { src });
  }

  let autoUpdateStatus = "";
  $: titleWindow = $status.folderName ? $status.folderName : "GEST DASHBOARD";
  $: statusLabel =
    $status.sw.clientId && $status.sw.swScope && $status.sw.hostName
      ? `CLIENT ID: ${$status.sw.clientId} - HOST: ${$status.sw.hostName} - SCOPE: ${$status.sw.swScope}`
      : "";

  $: src = $status.sw.swScope
    ? `${$status.sw.swScope}${$status.sw.hostName}/`
    : null;

  // AUTO UPDATER

  globalThis.api.updaterInfo.receive("autoUpdateAvailable", (data) => {
    console.log("autoUpdateAvailable");
    console.log(data);
    autoUpdateStatus = `${languages.appSvelte.newVersionAvailable[lang]} (${data.releaseName}) `;
  });
  globalThis.api.updaterInfo.receive("autoUpdateDownloaded", (data) => {
    console.log("autoUpdateDownloaded");
    autoUpdateStatus = `${data.releaseName} ${languages.appSvelte.newVersionDownloaded[lang]}`;
  });
</script>

<svelte:head>
  <title>GEST DASHBOARD</title>
</svelte:head>

<GlobalThisAPI />
<MainWithTitlebar title={titleWindow}>
  <LeftBar slot="leftbar" />
  <RightBar slot="rightbar" />

  <main slot="page">
    <svelte:component this={$status.componentVisible} />
  </main>
  <StatusBar slot="statusbar" status={`${autoUpdateStatus}  ${statusLabel}`} />
</MainWithTitlebar>

<style lang="postcss">
  main {
    @apply h-full;
  }
</style>
