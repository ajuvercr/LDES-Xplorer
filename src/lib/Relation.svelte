<script lang="ts">
  import { goto } from "$app/navigation";
  import type { LdesRelation } from "../routes/ldes/[slug]/+page";
  import Property from "./Property.svelte";
  import Paper, { Subtitle, Content } from "@smui/paper";

  export let rel: LdesRelation;

  export let selected = false;

  function onClick() {
    const url = encodeURIComponent(ref);
    goto("/ldes/" + url);
  }

  function handleKeyDown(event: CustomEvent | KeyboardEvent) {
    event = event as KeyboardEvent;
    if (event.key === "Enter" && selected) {
      onClick();
    }
  }

  $: ({ ty, ref, path, values } = rel);
</script>

<Paper
  on:click={onClick}
  on:keydown={handleKeyDown}
  style="cursor: pointer"
>
  <Subtitle>Relation to {ref}</Subtitle>
  {#if path}
    <Content>
      where '<Property url={path} />'
      {ty}
      {#each values || [] as value}
        {value}
      {/each}
    </Content>
  {/if}
</Paper>

