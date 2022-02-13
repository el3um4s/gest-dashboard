<script lang="ts">
  import { slide } from "svelte/transition";
  const isElectron = globalThis?.api?.systemInfo ? true : false;

  const tech = [
    { value: "iframe", text: "IFrame", visible: !isElectron },
    {
      value: "browserview",
      text: "BrowserView (ElectronJS)",
      visible: isElectron,
    },
  ];

  let techSelected = isElectron ? "browserview" : "iframe";
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
</section>

<style lang="postcss">
  section {
    @apply p-2;
  }
  div {
    @apply m-4;
  }
</style>
