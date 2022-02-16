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

  $: valueChanged = techSelected != $status.tech;
</script>

<section transition:slide>
  <h1>Settings</h1>

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
        }}
        class="button-cancel">Discard</button
      >
      <button
        on:click={async () => {
          await status.tech(techSelected);
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
