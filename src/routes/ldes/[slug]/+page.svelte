<script lang="ts">
  import Accordion, { Panel, Header, Content } from "@smui-extra/accordion";
  import Relation from "$lib/Relation.svelte";
  import View from "$lib/View.svelte";
  import LayoutGrid, { Cell } from "@smui/layout-grid";

  import type { PageData } from "./$types";
  import Members from "$lib/Members.svelte";

  export let data: PageData;

  $: relations = data.relations;
  $: views = data.views;
  $: members = data.members;
</script>

<div class="accordion-container">
  <Accordion multiple>
    <Panel disabled={!views.length} extend>
      <Header
        >Views
        <span slot="description"
          >Found {views.length} view{#if views.length != 1}s{/if}</span
        >
      </Header>
      <Content>
        <ul>
          {#each views as rel}
            <li>
              <View {...rel} />
            </li>
          {/each}
        </ul>
      </Content>
    </Panel>
    <Panel disabled={!relations.length} extend>
      <Header
        >Relations
        <span slot="description"
          >Found {relations.length} linked page{#if relations.length != 1}s{/if}</span
        >
      </Header>
      <Content>
        <LayoutGrid>
          {#each relations as rel}
            <Cell span={4}>
              <Relation {rel} />
            </Cell>
          {/each}
        </LayoutGrid>
      </Content>
    </Panel>
    <Panel disabled={!members.length} extend>
      <Header
        >Members
        <span slot="description"
          >Found {members.length} member{#if members.length != 1}s{/if} on this page</span
        >
      </Header>
      <Content>
        <Members {members} data={data.triples} />
      </Content>
    </Panel>
  </Accordion>
</div>

{#if data.error}
  <p>Error {JSON.stringify(data.error)}!</p>
{/if}

<style>
  .accordion-container {
    margin-top: 40px;
  }
</style>
