<script lang="ts">
  import { slide } from "svelte/transition";
  import InfoApp from "../Default/InfoApp.svelte";
  import CheckForUpdate from "../Default/CheckForUpdate.svelte";

  const isElectron = globalThis?.api?.systemInfo ? true : false;
  export let version = "0.0.14";
</script>

<section transition:slide>
  <h1>Info</h1>
  <article>
    {#if isElectron}
      <div>
        <InfoApp />
      </div>
      <div>
        <CheckForUpdate />
      </div>
    {:else}
      <div>
        <ul>
          <li>Version: <b>iframe - {version}</b></li>
        </ul>
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
