<script lang="ts">
  import { slide } from "svelte/transition";
  import { status } from "../../Stores/Status";

  let showIndexHtmlImmediately = $status.showIndexHtmlImmediately;
  let reloadWhenFolderChange = $status.reloadWhenFolderChange;
  let lang = $status.lang;

  $: valueChanged =
    showIndexHtmlImmediately != $status.showIndexHtmlImmediately ||
    reloadWhenFolderChange != $status.reloadWhenFolderChange ||
    lang != $status.lang;

  let languages = [
    { id: "en", text: `English` },
    { id: "it", text: `Italiano` },
  ];
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
    <h3>Watch for changes and <b>auto reload</b> the local folder</h3>
    <label>
      <input type="radio" bind:group={reloadWhenFolderChange} value="no" />
      No
    </label>

    <label>
      <input
        type="radio"
        bind:group={reloadWhenFolderChange}
        value="current page"
      />
      Reload the current page
    </label>

    <label>
      <input
        type="radio"
        bind:group={reloadWhenFolderChange}
        value="local folder"
      />
      Reload the local folder
    </label>
  </div>
  <div>
    <label>
      Language
      <select bind:value={lang}>
        {#each languages as language}
          <option value={language.id}>
            {language.text}
          </option>
        {/each}
      </select>
    </label>
  </div>
  {#if valueChanged}
    <div transition:slide>
      <button
        on:click={() => {
          showIndexHtmlImmediately = $status.showIndexHtmlImmediately;
          reloadWhenFolderChange = $status.reloadWhenFolderChange;
          lang = $status.lang;
        }}
        class="button-cancel">Discard</button
      >
      <button
        on:click={async () => {
          await status.showIndexHtmlImmediately(showIndexHtmlImmediately);
          await status.reloadWhenFolderChange(reloadWhenFolderChange);
          await status.lang(lang);
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
