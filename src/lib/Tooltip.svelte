<script lang="ts">
  import { toolTipContent } from "$lib/util";
  let isHovered = false;
  let div: HTMLDivElement;
  export let content: string;

  function setContent() {
    const { x, y, width, height } = div.getBoundingClientRect();
    console.log({x, y, width, height});
    toolTipContent.set({ content, hovered: isHovered, x, y, width, height });
  }

  function mouseEnter() {
    isHovered = true;
    setContent();
  }

  function mouseOver() {
    if (!isHovered) {
      isHovered = true;
      setContent();
    }
  }

  function mouseLeave() {
    isHovered = false;
    setContent();
  }

  $: if (isHovered) {
    toolTipContent.update((x) => {
      x.content = content;
      return x;
    });
  }
</script>

<div
  bind:this={div}
  on:focus={mouseEnter}
  on:mouseover={mouseOver}
  on:mouseleave={mouseLeave}
  class="tooltip-wrapper"
>
  <slot />
</div>

<style>
  .tooltip-wrapper {
    position: relative;
    display: inline-block;
    padding: 3px;
  }
</style>
