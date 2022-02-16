<script lang="ts">
  import "./css/tailwind.pcss";

  import { onMount } from "svelte";
  import { tick } from "svelte";

  import { status } from "./Stores/Status";

  import { SW } from "./sw/serviceWorker";
  import { handleFetch } from "./sw/fetchHandler";

  import MainWithTitlebar from "./Components/Default/MainWithTitlebar.svelte";
  import StatusBar from "./Components/Default/StatusBar.svelte";
  import LeftBar from "./Components/Default/LeftBar.svelte";

  import Iframe from "./Components/Pages/Iframe.svelte";
  status.isElectron(globalThis?.api?.systemInfo ? true : false);
  status.tech($status.isElectron ? "browserview" : "iframe");

  onMount(async () => {
    await SW.register();
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
        handleFetch($status.sw.folderHandle, e);
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
  }

  $: titleWindow = $status.folderName ? $status.folderName : "GEST DASHBOARD";
  $: statusLabel =
    $status.sw.clientId && $status.sw.swScope && $status.sw.hostName
      ? `CLIENT ID: ${$status.sw.clientId} - HOST: ${$status.sw.hostName} - SCOPE: ${$status.sw.swScope}`
      : "";

  $: src = $status.sw.swScope
    ? `${$status.sw.swScope}${$status.sw.hostName}/`
    : null;
</script>

<svelte:head>
  <title>GEST DASHBOARD</title>
</svelte:head>

<MainWithTitlebar title={titleWindow}>
  <LeftBar slot="leftbar" />

  <main slot="page">
    <svelte:component this={$status.componentVisible} />

    {#if $status.tech == "iframe"}
      <Iframe title={$status.folderName} {src} hidden={!$status.showIframe} />
    {/if}
  </main>
  <StatusBar slot="statusbar" status={statusLabel} />
</MainWithTitlebar>

<style lang="postcss">
  main {
    @apply h-full;
  }
</style>
