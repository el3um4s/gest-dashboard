<script lang="ts">
  import { slide } from "svelte/transition";
  const isElectron = globalThis?.api?.systemInfo ? true : false;
</script>

<section transition:slide>
  <h1>Help</h1>

  <div />
</section>

<style lang="postcss">
  section {
    @apply p-2;
  }
  div {
    @apply m-4;
  }
</style>
