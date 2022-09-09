<script lang="ts">
  import { slide } from "svelte/transition";
  import InfoApp from "../Default/InfoApp.svelte";
  import CheckForUpdate from "../Default/CheckForUpdate.svelte";

  import systemInfo from "@el3um4s/renderer-for-electron-system-info";
  let isWindows = false;

  systemInfo.requestIsWindows({
    callback: (data) => {
      isWindows = data.isWindows;
    },
  });
</script>

<section transition:slide>
  <h1>Info</h1>
  <article>
    <div>
      <InfoApp />
    </div>
    {#if isWindows}
      <div>
        <CheckForUpdate />
      </div>
    {/if}
  </article>
</section>

<style lang="postcss">
  section {
    @apply p-2;
  }
  div {
    @apply m-4;
  }
</style>
