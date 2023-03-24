<script lang="ts">
  import Tooltip from "./Tooltip.svelte";
  import { getProperty } from "./properties";

  export let url: string;
  export let noLookup: boolean = false;

  $: prop = getProperty(url, noLookup);
  $: content = `
<p>
  Short for ${$prop.url}
</p>
${!!$prop.description ? "<p>" + $prop.description + "</p>" : ""}`;
</script>

<Tooltip {content}>
  <span>
    {$prop.name}
  </span>
  <svelte:fragment slot="tip">
    <div class="tip">
      <p>
        Short for {$prop.url}
      </p>
      {#if $prop.description}
        <p>
          {$prop.description}
        </p>
      {/if}
    </div>
  </svelte:fragment>
</Tooltip>

<style>
  .tip {
    width: max-content;
    max-width: 750px;
  }
</style>
