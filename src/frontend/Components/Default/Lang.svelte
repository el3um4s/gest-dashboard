<script lang="ts">
  import { status } from "../../Stores/Status";
  import languages from "../../Languages/Languages";
  $: lang = $status.lang;

  export let c: string;
  export let v: string;
</script>

{@html languages[c][v][lang]}
