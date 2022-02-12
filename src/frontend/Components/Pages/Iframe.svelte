<script lang="ts">
  export let title: string;
  export let src: string;
  export let hidden: boolean = true;
</script>

<div {hidden}>
  {#if src}
    <iframe {title} width="100%" height="100%" {src} />
  {/if}
</div>

<style lang="postcss">
  div {
    height: 100%;
  }
</style>
