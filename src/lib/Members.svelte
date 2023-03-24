<script lang="ts">
  import DataTable, { Head, Body, Row, Cell } from "@smui/data-table";
  import type { Quad, Term } from "n3";
  import Property from "./Property.svelte";
  export let members: Term[];
  export let data: Quad[];

  type Data = {
    fields: string[];
    members: { [field: string]: Term[] }[];
  };

  function calculateData(ids: Term[], data: Quad[]): Data {
    const fields: Set<string> = new Set();
    fields.add("id");
    const members: { [field: string]: Term[] }[] = [];

    for (let id of ids) {
      const member: { [field: string]: Term[] } = {};
      member["id"] = [id];
      const quads = data.filter((q) => q.subject.equals(id));

      for (let quad of quads) {
        const field = quad.predicate.value;
        fields.add(field);
        if (!member[field]) member[field] = [];

        if (!member[field].find((q) => q.value === quad.object.value)) {
          member[field].push(quad.object);
        }
      }

      members.push(member);
    }

    return { fields: [...fields.keys()], members };
  }

  $: thisData = calculateData(members, data);
</script>

<DataTable style="max-width: 100%">
  <Head>
    <Row>
      {#each thisData.fields as field}
        <Cell style="overflow: visible;"><Property url={field} /></Cell>
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
