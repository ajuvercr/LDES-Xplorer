<script lang="ts">
  import Accordion, { Panel, Header, Content } from "@smui-extra/accordion";
  import Relation from "$lib/Relation.svelte";
  import View from "$lib/View.svelte";
  import LayoutGrid, { Cell } from "@smui/layout-grid";
  import LinearProgress from "@smui/linear-progress";
  import Members from "$lib/Members.svelte";

  import type { Quad, Term } from "n3";
  import { RDF, TREE, curlQuads } from "$lib/util";
  import { onMount } from "svelte";
  import { page } from "$app/stores";

  let loading = false;

  type LdesRelation = {
    ty: string;
    ref: string;
    path?: string;
    values?: string[];
  };

  type LdesView = {
    ldes: string;
    view: string;
    url: string;
  };

  function getTy(inp: string): string {
    switch (inp) {
      case TREE.GreaterThanOrEqualRelation:
        return "is greater than or equal to";
      case TREE.custom("EqualThanRelation"):
        return "equals";
      case TREE.custom("GreaterThanRelation"):
        return "is greater than";
      case TREE.custom("GreaterThanOrEqualToRelation"):
        return "is greater than or equal to";
      case TREE.custom("LessThanRelation"):
        return "is less than";
      case TREE.custom("LessThanOrEqualToRelation"):
        return "is less than or equal to";
      case TREE.custom("PrefixRelation"):
        return "starts with";
      case TREE.custom("SubstringRelation"):
        return "has substring";
      case TREE.custom("SuffixRelation"):
        return "ends with";
    }
    return "??";
  }

  function findRelation(triples: Quad[], id: Term): LdesRelation[] {
    const mTy =
      triples.find(
        (q) => q.subject.equals(id) && q.predicate.equals(RDF.terms.type)
      )?.object.value || TREE.custom("Relation");

    const ty = getTy(mTy);
    const ref = triples.find(
      (q) => q.subject.equals(id) && q.predicate.equals(TREE.terms.node)
    )?.object.value;
    if (!ref) return [];

    const path = triples.find(
      (q) => q.subject.equals(id) && q.predicate.equals(TREE.terms.path)
    )?.object.value;
    const values = triples
      .filter(
        (q) => q.subject.equals(id) && q.predicate.equals(TREE.terms.value)
      )
      .map((q) => q.object.value);

    return [{ ref, ty, path, values }];
  }

  async function loadData(slug: string) {
    loading = true;
    let triples: Quad[] = [];
    let members: Term[] = [];
    let views: LdesView[] = [];
    let relations: Term[] = [];
    let error: any;

    try {
      triples = await curlQuads(
        slug,
        { headers: { accept: "application/ld+json, text/turtle" } },
        fetch
      );

      for (let triple of triples) {
        if (triple.predicate.equals(TREE.terms.view)) {
          const ldes = triple.subject.value;
          const url = triple.object.value;

          views.push({ ldes, url, view: url });
        }

        if (triple.predicate.equals(TREE.terms.relation)) {
          relations.push(triple.object);
        }
        if (triple.predicate.equals(TREE.terms.member)) {
          members.push(triple.object);
        }
      }
    } catch (ex) {
      error = ex;
    }

    loading = false;
    return {
      triples,
      error,
      members,
      views,
      relations,
    };
  }

  let relations: LdesRelation[] = [];
  let views: LdesView[] = [];
  let members: Term[] = [];
  let triples: Quad[] = [];

  const setData = (data: Awaited<ReturnType<typeof loadData>>) => {
    relations = data.relations.flatMap((x) => findRelation(data.triples, x));
    views = data.views;
    members = data.members;
    triples = data.triples;
  };

  onMount(async () => {
    // await loadData($page.params.slug).then(setData);

    return page.subscribe((page) => {
      loadData(page.params.slug).then(setData);
    });
  });
</script>

<div class="accordion-container">
  {#if loading}<LinearProgress indeterminate />{/if}

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
        <Members {members} data={triples} />
      </Content>
    </Panel>
  </Accordion>
</div>

<style>
  .accordion-container {
    margin-top: 40px;
  }
</style>
