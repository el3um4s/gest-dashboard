<script lang="ts">
  import { slide } from "svelte/transition";
  import { status } from "../../Stores/Status";

  const tech = [
    { value: "iframe", text: "IFrame", visible: true },
    {
      value: "browserview",
      text: "BrowserView (ElectronJS)",
      visible: $status.isElectron,
    },
  ];

  let techSelected = $status.tech;
  let showIndexHtmlImmediately = $status.showIndexHtmlImmediately;

  $: valueChanged =
    techSelected != $status.tech ||
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
  <div>
    <label for="tech-select">Use:</label>

    <select id="tech-select" bind:value={techSelected}>
      {#each tech as t}
        {#if t.visible}
          <option value={t.value}>
            {t.text}
          </option>
        {/if}
      {/each}
    </select>
  </div>
  {#if valueChanged}
    <div transition:slide>
      <button
        on:click={() => {
          techSelected = $status.tech;
          showIndexHtmlImmediately = $status.showIndexHtmlImmediately;
        }}
        class="button-cancel">Discard</button
      >
      <button
        on:click={async () => {
          await status.tech(techSelected);
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
