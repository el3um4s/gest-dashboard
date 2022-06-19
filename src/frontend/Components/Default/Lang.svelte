<script lang="ts">
  import { status } from "../../Stores/Status";
  import languages from "../../Languages/languages";
  $: lang = $status.lang;

  export let c: string;
  export let v: string;
</script>

<span>{languages[c][v][lang]}</span>
