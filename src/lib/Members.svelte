<script lang="ts">
  import DataTable, { Head, Body, Row, Cell } from "@smui/data-table";
  import { RDF } from "./util";
  import { NamedNode, type Quad, type Term } from "n3";
  import Property from "./Property.svelte";
  export let members: Term[];
  export let data: Quad[];

  export let paths: Term[] = [];

  type Data = {
    fields: string[];
    members: { [field: string]: Term[] }[];
  };

  type Sub = {
    subject: Term;
    id: Term;
  };

  function findPredicate(ids: Sub[], data: Quad[], predicate: Term): Sub[] {
    return ids.flatMap(({ subject, id }) =>
      data
        .filter(
          (x) =>
            x.subject.equals(subject) &&
            x.predicate.equals(predicate) &&
            x.object.termType !== "Literal"
        )
        .map((x) => {
          return { id, subject: x.object };
        })
    );
  }

  let deepFields: Set<string> = new Set();

  function calculateData(startIds: Term[], data: Quad[], paths: Term[]): Data {
    deepFields = new Set();
    let ids = startIds.map((id) => {
      return { subject: id, id };
    });

    for (let p of paths) {
      ids = findPredicate(ids, data, p);
    }

    const fields: Set<string> = new Set();
    fields.add("id");
    fields.add(RDF.type);

    const members: { [field: string]: Term[] }[] = [];

    for (let { id, subject } of ids) {
      const member: { [field: string]: Term[] } = {};
      member["id"] = [id];

      const quads = data.filter((q) => q.subject.equals(subject));
      for (let quad of quads) {
        const field = quad.predicate.value;
        fields.add(field);
        if (!member[field]) member[field] = [];

        if (quad.object.termType === "BlankNode") {
          deepFields.add(field);
        }

        if (!member[field].find((q) => q.value === quad.object.value)) {
          member[field].push(quad.object);
        }
      }

      members.push(member);
    }

    return { fields: [...fields.keys()], members };
  }

  function pushPath(newPath: string) {
    paths = [...paths, new NamedNode(newPath)];
  }

  function removePaths(index: number) {
    if (index === 0) paths = [];
    else paths = paths.slice(index - 1);
  }

  $: thisData = calculateData(members, data, paths);
</script>

<div class="crumbs">
  {#each paths as path, i}
    <span class="crumb" on:click={() => removePaths(i)}>{path.value}</span>
    <span> / </span>
  {/each}
</div>
<DataTable style="max-width: 100%">
  <Head>
    <Row>
      {#each thisData.fields as field}
        {#if deepFields.has(field)}
          <Cell style="overflow: visible; background-color: #5252cf; cursor: pointer;"
            ><Property on:click={() => pushPath(field)} url={field} /></Cell
          >
        {:else}
          <Cell style="overflow: visible"><Property url={field} /></Cell>
        {/if}
      {/each}
    </Row>
  </Head>
  <Body>
    {#each thisData.members as member}
      <Row>
        {#each thisData.fields as field}
          <Cell>
            {#if member[field]}
              {#each member[field] as f}
                {#if f.termType === "NamedNode"}
                  <Property url={f.value} noLookup />
                {:else}
                  {f.value}
                {/if}
              {/each}
            {/if}
          </Cell>
        {/each}
      </Row>
    {/each}
  </Body>
</DataTable>

<style>
  .crumbs {
    display: flex;
    gap: 4px;
  }
  .crumb {
    cursor: pointer;
  }

  .crumb:hover {
    color: #5252cf;
  }
</style>
