<script lang="ts">
  import { slide } from "svelte/transition";
  const isElectron = globalThis?.api?.systemInfo ? true : false;

  let files;
  let source: string;
  let sql: string;
  let tables = [];
  let resultQuery;

  let showFileName = true;
  let showCustomSQL = false;
  let showListTable = false;

  $: if (isElectron && files && files[0]) {
    // console.log(files[0].path);
    source = files[0].path;
    // const sql = "SELECT * FROM Users";
    // globalThis.api.nodeAdodb.send("query", { source: source, sql });
    globalThis.api.nodeAdodb.send("listTables", { source: source });
  }

  globalThis.api.nodeAdodb.receive("queryResult", (data) => {
    console.log("RECEIVED queryResult");
    console.log(data);
  });

  globalThis.api.nodeAdodb.receive("listTablesResult", (data) => {
    console.log("RECEIVED listTablesResult");
    console.log(data);
    tables = [...data];
  });

  let showInProduction = false;
</script>

<section transition:slide>
  <h1>Help</h1>

  <p>TO DO...</p>
  {#if showInProduction}
    <input type="file" bind:files />

    <button on:click={() => (showFileName = !showFileName)}>File Name</button>
    <button on:click={() => (showCustomSQL = !showCustomSQL)}>SQL Query</button>
    {#if tables.length > 0}
      <button on:click={() => (showListTable = !showListTable)}
        >List Tables</button
      >{/if}
    {#if files && files[0] && showFileName}
      <p>
        {files[0].name}
      </p>
    {/if}

    {#if showCustomSQL}
      <button
        on:click={() =>
          globalThis.api.nodeAdodb.send("query", { source: source, sql })}
        >Execute query</button
      >
      <textarea bind:value={sql} />
    {/if}
    {#if showListTable}
      {#each tables as table}
        <p>{table.TABLE_NAME}</p>
      {/each}
    {/if}
    <div />
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
