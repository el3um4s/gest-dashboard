<script lang="ts">
  import { slide } from "svelte/transition";
  const isElectron = globalThis?.api?.systemInfo ? true : false;

  let files;

  let tables = [];

  $: console.log(files);
  $: if (isElectron && files && files[0]) {
    // console.log(files[0].path);
    const path = files[0].path;
    // const sql = "SELECT * FROM Users";
    // globalThis.api.nodeAdodb.send("query", { positionDB: path, sql });
    globalThis.api.nodeAdodb.send("listTables", { positionDB: path });
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
</script>

<section transition:slide>
  <h1>Help</h1>

  <input type="file" bind:files />

  {#if files && files[0]}
    <p>
      {files[0].name}
    </p>
  {/if}

  {#each tables as table}
    <p>{table.TABLE_NAME}</p>
  {/each}
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
