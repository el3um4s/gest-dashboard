<script lang="ts">
  import { flip } from "svelte/animate";

  import Fa from "svelte-fa";
  export let listButtons = [];

  $: list = listButtons.filter((b) => b.visible);
</script>

<section>
  {#each list as button (button.id)}
    <button
      class="icon"
      title={button.title}
      on:click={button.onClick}
      animate:flip
    >
      <Fa icon={button.icon} />
    </button>
  {/each}
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
