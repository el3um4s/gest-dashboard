<script lang="ts">
  import "./css/tailwind.pcss";

  import { onMount } from "svelte";
  import { slide } from "svelte/transition";
  import { tick } from "svelte";

  import { SW } from "./sw/serviceWorker";
  import { FolderHandle } from "./sw/folderHandler";
  import { handleFetch } from "./sw/fetchHandler";

  import MainWithTitlebar from "./Components/Default/MainWithTitlebar.svelte";
  import LeftBar from "./Components/Default/LeftBar.svelte";
  import StatusBar from "./Components/Default/StatusBar.svelte";

  import Iframe from "./Components/Pages/Iframe.svelte";
  import Help from "./Components/Pages/Help.svelte";
  import Info from "./Components/Pages/Info.svelte";
  import Settings from "./Components/Pages/Settings.svelte";

  let component;

  let folderHandle = null;
  let hostName = "";
  let swScope = null;
  let clientId = "";

  $: src = swScope ? `${swScope}${hostName}/` : null;

  onMount(async () => {
    await SW.register();
  });

  window.addEventListener("unload", () => {
    SW.post({
      type: "host-stop",
      hostName,
    });
  });

  // Handle messages from SW
  navigator.serviceWorker.addEventListener("message", (e) => {
    switch (e.data.type) {
      case "start-ok":
        onHostStarted(e.data);
        break;
      case "fetch":
        handleFetch(folderHandle, e);
        break;
      default:
        console.warn(`Unknown message from SW '${e.data.type}'`);
        break;
    }
  });

  // SW indicates hosting started OK: get info and display URL
  function onHostStarted(data) {
    hostName = data.hostName;
    swScope = data.scope;
    clientId = data.clientId;
  }

  let showIframe = false;

  $: titleWindow = folderHandle?.name ? folderHandle.name : "GEST DASHBOARD";
  $: status =
    clientId && swScope && hostName
      ? `CLIENT ID: ${clientId} - HOST: ${hostName} - SCOPE: ${swScope}`
      : "";
</script>

<MainWithTitlebar title={titleWindow}>
  <LeftBar
    slot="leftbar"
    on:open-folder={async () => {
      component = undefined;
      showIframe = false;
      folderHandle = null;
      folderHandle = await FolderHandle.init();
      showIframe = folderHandle ? true : false;
    }}
    on:show-settings={() => {
      showIframe = false;
      component = Settings;
    }}
    on:show-help={() => {
      showIframe = false;
      component = Help;
    }}
    on:show-info={() => {
      showIframe = false;
      component = Info;
    }}
    on:show-folder={() => {
      showIframe = true;
      component = undefined;
    }}
    on:reload-folder={async () => {
      component = undefined;
      src = null;
      await tick();
      src = `${swScope}${hostName}/`;
      showIframe = true;
    }}
    on:open-new-window={() => {
      const message = {
        link: undefined,
      };
      globalThis.api.windowManager.send("openInNewWindow", message);
    }}
  />
  <main slot="page">
    <svelte:component this={component} />

    <Iframe title={folderHandle?.name} {src} hidden={!showIframe} />
  </main>
  <StatusBar slot="statusbar" {status} />
</MainWithTitlebar>

<style lang="postcss">
  main {
    @apply h-full;
  }
</style>
