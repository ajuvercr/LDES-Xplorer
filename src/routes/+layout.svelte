<script lang="ts">
  import TopAppBar, { Row, Section, Title } from "@smui/top-app-bar";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";

  import { Input } from "@smui/textfield";
  import Paper from "@smui/paper";
  import Fab from "@smui/fab";
  import { Icon } from "@smui/common";
  import { get } from "svelte/store";
  import { onDestroy } from "svelte";

  import { toolTipContent } from "$lib/util";

  let m = { x: 0, y: 0, w: 0, h: 0 };

  function handleMousemove(event: MouseEvent) {
    m.x = event.pageX;
    m.y = event.pageY;
  }

  let value: string | null = null;
  if ($page.params.slug) {
    value = get(page).params.slug;
  }

  function enter() {
    if (value) {
      const uri = encodeURIComponent(value);
      goto("/ldes/" + uri);
    }
  }

  function handleKeyDown(event: CustomEvent | KeyboardEvent) {
    event = event as KeyboardEvent;
    if (event.key === "Enter") {
      enter();
    }
  }

  let unsub = page.subscribe((page) => (value = page.params.slug));
  onDestroy(unsub);

  // $: value = $page.params.slug;
</script>

<svelte:head>
  <title>Xplorer - LDES</title>
  <link
    href="https://fonts.googleapis.com/icon?family=Material+Icons"
    rel="stylesheet"
  />
  <link
    rel="stylesheet"
    href="/smui.css"
    media="(prefers-color-scheme: light)"
  />
  <link
    rel="stylesheet"
    href="/smui-dark.css"
    media="screen and (prefers-color-scheme: dark)"
  />
</svelte:head>

<div class="flexy" on:mousemove={handleMousemove}>
  {#if $toolTipContent.hovered}
    <div
      class="tooltip"
      bind:clientWidth={m.w}
      style="top: {m.y + m.h + 20}px; left: {Math.max(m.x - m.w / 2, 0)}px;"
    >
      {@html $toolTipContent.content}
    </div>
  {/if}
  <div class="top-app-bar-container">
    <TopAppBar variant="static" prominent={false} dense={false} color="primary">
      <Row class="top-app-bar-row">
        <Section>
          <Title class="title" on:click={() => goto("/")}></Title>
          {#if $page.params.slug}
            <div class="searchField">
              <Paper class="solo-paper" elevation={2}>
                <Input
                  bind:value
                  on:keydown={handleKeyDown}
                  placeholder="Search"
                  class="solo-input"
                />
              </Paper>
              <Fab
                on:click={enter}
                disabled={value === ""}
                color="secondary"
                mini
                class="solo-fab"
              >
                <Icon class="material-icons">arrow_forward</Icon>
              </Fab>
            </div>
          {/if}

          <slot name="topbar" />
        </Section>
      </Row>
    </TopAppBar>
  </div>
  <div class="main-container">
    <div class="main">
      <slot />
    </div>
  </div>
</div>

<style>
  .flexy {
    width: 100%;
    height: 100%;
    position: relative;
  }

  * :global(.title) {
    width: 500px;
    background-size: contain;
    background-repeat: no-repeat;
    background-image: url(/ldes-logo.svg);
    height: 100%;
  }

  .tooltip {
    position: absolute;
    display: inline-block;
    z-index: 10;
    border: 1px solid #ddd;
    box-shadow: 1px 1px 1px #ddd;
    background: white;
    border-radius: 4px;
    padding: 4px;
    position: absolute;
    transition-property: opacity;
    transition-duration: 0.2s;
    overflow: visible !important;
    white-space: normal !important;
    max-width: 750px;
  }

  .top-app-bar-container {
    width: 100%;
  }
  * :global(.top-app-bar-row) {
    width: 90%;
    max-width: 1600px;
    margin: auto;
  }
  * :global(.title) {
    cursor: pointer;
  }

  .main {
    width: 80%;
    max-width: 1400px;
    margin: auto;
    height: 100%;
  }

  .searchField {
    width: 80%;
    display: flex;
    margin: 20px;
  }

  * :global(.solo-paper) {
    /* background-color: var(--secondary) !important; */
    display: flex;
    align-items: center;
    flex-grow: 1;
    margin: 0 12px;
    padding: 0 12px;
  }
</style>
