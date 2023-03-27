<script lang="ts">
  import Textfield from "@smui/textfield";
  import Fab from "@smui/fab";
  import { Icon } from "@smui/common";
  import { goto } from "$app/navigation";

  let value: string | null = null;

  function input(event: KeyboardEvent) {
    if (event.code == "Enter") {
      enter();
    }
  }

  function enter() {
    if (value) {
      const uri = encodeURIComponent(value);
      goto("/ldes/" + uri);
    }
  }
</script>

<svelte:window on:keydown={input} />
<div class="container">
  <div class="body">
    <Textfield
      bind:value
      label="LDES to explore"
      style="min-width: 500px; width: 80%;"
    />
    <Fab
      on:click={enter}
      disabled={value === ""}
      color="primary"
      mini
      class="solo-fab"
    >
      <Icon class="material-icons">arrow_forward</Icon>
    </Fab>
  </div>
</div>

<style lang="postcss">
  .body {
    margin: auto;
    padding-top: 400px;
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: center;
  }
</style>
