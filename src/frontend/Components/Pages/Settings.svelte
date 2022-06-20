<script lang="ts">
  import { slide } from "svelte/transition";
  import { status } from "../../Stores/Status";

  import Lang from "../Default/Lang.svelte";

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
  <h1><Lang c="settings" v="title" /></h1>

  <div>
    <label>
      <input type="checkbox" bind:checked={showIndexHtmlImmediately} />
      <Lang c="settings" v="runHtmlImmediately" />
    </label>
  </div>
  <div>
    <h3><Lang c="settings" v="watchForChanges" /></h3>
    <label>
      <input type="radio" bind:group={reloadWhenFolderChange} value="no" />
      <Lang c="settings" v="no" />
    </label>

    <label>
      <input
        type="radio"
        bind:group={reloadWhenFolderChange}
        value="current page"
      />
      <Lang c="settings" v="reloadCurrentPage" />
    </label>

    <label>
      <input
        type="radio"
        bind:group={reloadWhenFolderChange}
        value="local folder"
      />
      <Lang c="settings" v="reloadLocalFolder" />
    </label>
  </div>
  <div>
    <label>
      <Lang c="settings" v="language" />
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
        class="button-cancel"><Lang c="settings" v="discard" /></button
      >
      <button
        on:click={async () => {
          await status.showIndexHtmlImmediately(showIndexHtmlImmediately);
          await status.reloadWhenFolderChange(reloadWhenFolderChange);
          await status.lang(lang);
        }}
        class="button-confirm"><Lang c="settings" v="saveChanges" /></button
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
