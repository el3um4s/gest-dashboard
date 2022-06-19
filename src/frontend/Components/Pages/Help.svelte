<script lang="ts">
  import { slide } from "svelte/transition";
  import Lang from "../Default/Lang.svelte";
</script>

<section transition:slide>
  <h1><Lang c="help" v="help" /></h1>

  <p><Lang c="help" v="toDo" /></p>
</section>

<style lang="postcss">
  section {
    @apply p-2;
  }
</style>
