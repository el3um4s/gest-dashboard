<script lang="ts">
  import { slide } from "svelte/transition";
  import { status } from "../../Stores/Status";

  let showIndexHtmlImmediately = $status.showIndexHtmlImmediately;

  $: valueChanged =
    showIndexHtmlImmediately != $status.showIndexHtmlImmediately;
</script>

<section transition:slide>
  <h1>Settings</h1>

  <div>
    <label>
      <input type="checkbox" bind:checked={showIndexHtmlImmediately} />
      Run <b>index.html</b> immediately
    </label>
  </div>
  {#if valueChanged}
    <div transition:slide>
      <button
        on:click={() => {
          showIndexHtmlImmediately = $status.showIndexHtmlImmediately;
        }}
        class="button-cancel">Discard</button
      >
      <button
        on:click={async () => {
          await status.showIndexHtmlImmediately(showIndexHtmlImmediately);
        }}
        class="button-confirm">Save Changes</button
      >
    </div>
  {/if}
</section>

<style lang="postcss">
  section {
    @apply p-2;
  }
  div {
    @apply m-4;
  }
</style>
