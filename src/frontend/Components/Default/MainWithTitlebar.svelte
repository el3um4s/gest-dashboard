<script lang="ts">
  import { TitleBar } from "@el3um4s/svelte-titlebar";
  export let title: string = "GEST DASHBOARD";

  let outerW = globalThis.outerWidth - 8;
  let isMaximized = outerW >= globalThis.screen.availWidth;

  $: {
    isMaximized = outerW >= globalThis.screen.availWidth;
  }

  function minimize() {
    console.log("minimize");
    globalThis.api.windowControls.send("minimize", null);
  }
  function maximize() {
    console.log("maximize");
    globalThis.api.windowControls.send("maximize", null);
  }
  function close() {
    globalThis.api.windowControls.send("close", null);
  }
  function unmaximize() {
    globalThis.api.windowControls.send("unmaximize", null);
  }
</script>

<svelte:window bind:outerWidth={outerW} />

<main>
  <div class="titlebar">
    <TitleBar
      {title}
      {isMaximized}
      on:clickMinimize={minimize}
      on:clickUnmaximize={unmaximize}
      on:clickMaximize={maximize}
      on:clickClose={close}
    />
  </div>
  <div class="main">
    <div class="leftbar">
      <slot name="leftbar" />
    </div>
    <div class="page">
      <slot name="page" />
    </div>
    <div class="statusbar">
      <slot name="statusbar" />
    </div>
  </div>
</main>

<style lang="postcss">
  main {
    @apply w-full;
  }

  .titlebar {
    --background-color: var(--titlebar-background-color);
    --text-color: var(--titlebar-text-color);
  }

  .main {
    @apply overflow-hidden w-full h-full grid;
    border: 1px solid var(--window-border-color);
    grid-template-columns: 64px auto;
    grid-template-rows: calc(100% - 24px) 24px;
    grid-template-areas:
      "leftbar page"
      "statusbar statusbar";
    height: calc(100% - theme("spacing.8"));
  }

  .page {
    grid-area: page;
    @apply overflow-y-auto w-full h-full;
    overflow-y: overlay;
  }

  .leftbar {
    grid-area: leftbar;
    @apply w-14;
  }

  .statusbar {
    grid-area: statusbar;
    @apply h-6;
  }

  .page::-webkit-scrollbar {
    @apply w-4;
  }

  .page::-webkit-scrollbar-track {
    border: 2px solid var(--background-color);
    border-left: 8px solid var(--background-color);
    background-color: var(--background-color);
  }

  .page::-webkit-scrollbar-thumb {
    background-color: var(--hover-scrollbar-thumb);
    border-left: 8px solid var(--background-color);
  }
</style>
