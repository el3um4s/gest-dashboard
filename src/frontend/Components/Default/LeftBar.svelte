<script lang="ts">
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  import Fa from "svelte-fa";
  import {
    faFolderOpen,
    faEye,
    faRedoAlt,
    faExternalLinkSquareAlt,
    faCog,
    faQuestionCircle,
    faInfoCircle,
  } from "@fortawesome/free-solid-svg-icons";
</script>

<section>
  <button
    class="icon"
    title="Open folder in this window"
    on:click={() => {
      dispatch("open-folder");
    }}
  >
    <Fa icon={faFolderOpen} />
  </button>
  <button
    class="icon"
    title="Show folder in this window"
    on:click={() => {
      dispatch("show-folder");
    }}
  >
    <Fa icon={faEye} />
  </button>
  <button
    class="icon"
    title="Reload folder in this window"
    on:click={() => {
      dispatch("reload-folder");
    }}
  >
    <Fa icon={faRedoAlt} />
  </button>
  <button
    class="icon"
    title="Open new window"
    on:click={() => {
      dispatch("open-new-window");
    }}
  >
    <Fa icon={faExternalLinkSquareAlt} />
  </button>
  <button
    class="icon"
    title="Settings"
    on:click={() => {
      dispatch("show-settings");
    }}><Fa icon={faCog} /></button
  >
  <button
    class="icon"
    title="Help"
    on:click={() => {
      dispatch("show-help");
    }}><Fa icon={faQuestionCircle} /></button
  >
  <button
    class="icon"
    title="Info"
    on:click={() => {
      dispatch("show-info");
    }}><Fa icon={faInfoCircle} /></button
  >
</section>

<style lang="postcss">
  section {
    @apply overflow-y-auto h-full w-14 items-center justify-start gap-1 p-2;
    overflow-y: overlay;
    background-color: var(--sidebar-background-color);
    color: var(--sidebar-text-color);
  }

  button {
    border: 0;
  }
  .icon {
    @apply h-12 w-12  flex flex-col items-center justify-center;
  }

  .icon:hover {
    background-color: var(--sidebar-hover-background-color);
    color: var(--sidebar-hover-text-color);
  }

  section::-webkit-scrollbar {
    @apply w-2;
  }

  section::-webkit-scrollbar-track {
    border: 2px solid var(--background-color);
    border-left: 4px solid var(--background-color);
    background-color: var(--background-color);
  }

  section::-webkit-scrollbar-thumb {
    background-color: var(--background-color);
    border-left: 4px solid var(--background-color);
  }

  section::-webkit-scrollbar-thumb:hover {
    background-color: var(--hover-scrollbar-thumb);
    border: 0;
    border-left: 4px solid var(--background-color);
  }

  section::-webkit-scrollbar-track:hover {
    border: 2px solid var(--sidebar-text-color);
    border-left: 4px solid var(--background-color);
    background-color: var(--sidebar-text-color);
  }
</style>
