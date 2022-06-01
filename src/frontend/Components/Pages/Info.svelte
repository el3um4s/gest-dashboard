<script lang="ts">
  import { slide } from "svelte/transition";
  import InfoApp from "../Default/InfoApp.svelte";
  import CheckForUpdate from "../Default/CheckForUpdate.svelte";
</script>

<section transition:slide>
  <h1>Info</h1>
  <article>
    <div>
      <InfoApp />
    </div>
    <div>
      <CheckForUpdate />
    </div>
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
