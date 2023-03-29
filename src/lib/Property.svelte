<script lang="ts">
  import Tooltip from "./Tooltip.svelte";
  import { getProperty, type Property } from "./properties";

  export let url: string;
  export let noLookup: boolean = false;

  function getContent(prop: Property): string | void {
    if (prop.url === prop.name && !prop.description) {
      return;
    }

    let content = "";

    if (prop.url !== prop.name) {
      content += `<p>Short for ${prop.url}</p>`;
    }

    if (prop.description) {
      content += `<p>${prop.description}</p>`;
    }

    return content;
  }

  $: prop = getProperty(url, noLookup);
  $: content = getContent($prop);
</script>

{#if content}
  <Tooltip {content}>
    <span>
      {$prop.name}
    </span>
  </Tooltip>
{:else}
  {$prop.name}
{/if}

