<script lang="ts">
  import type { HistoryBrowser } from "../../Interfaces/StatusInterface";

  import Fa from "svelte-fa";
  import {
    faPlay,
    faTrash,
    faPen,
    faStar,
  } from "@fortawesome/free-solid-svg-icons";
  import { faStar as faStarLight } from "@fortawesome/free-solid-svg-icons";
  export let item: HistoryBrowser;
</script>

<section class="card">
  <div class="actions">
    <button title="Open Page ({item.url})" class="button-action">
      <Fa icon={faPlay} />
    </button>
    <button class="link button-action" title="Open Page ({item.url})">
      {item.url}
    </button>
    <button title="Star this page" class="button-action">
      <Fa icon={faStarLight} />
    </button>
  </div>

  <div class="note">
    Note: {item.note}
  </div>
  <div class="actions">
    <button title="Delete Page" class="button-cancel">
      <Fa icon={faTrash} />
    </button>
    <button title="Edit Note and Title" class="button-action">
      <Fa icon={faPen} />
    </button>
  </div>
</section>

<style lang="postcss">
</style>
