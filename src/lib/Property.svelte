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
      content += `<a href="${prop.url}" target="_blank">Short for ${prop.url}</a>`;
    }

    if (prop.description) {
      content += `<a href="${prop.url}" target="_blank">${prop.description}</a>`;
    }

    return content;
  }

  $: prop = getProperty(url, noLookup);
  $: content = getContent($prop);
</script>

{#if content}
  <Tooltip {content}>
    <span on:click>
      {$prop.name}
    </span>
  </Tooltip>
{:else}
  <a href={$prop.url} target="_blank">
    <span on:click>
      {$prop.name}
    </span>
  </a>
{/if}
