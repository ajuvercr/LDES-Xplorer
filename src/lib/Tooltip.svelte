<script lang="ts">
  import { toolTipContent } from "$lib/util";
  let isHovered = false;
  export let content: string;

  function mouseEnter() {
    console.log("mouse enter", content);
    isHovered = true;
    toolTipContent.set({ content, hovered: true });
  }

  function mouseOver() {
    if (!isHovered) {
      isHovered = true;
      toolTipContent.set({ content, hovered: true });
    }
  }

  function mouseLeave() {
    isHovered = false;
    toolTipContent.set({ content: "", hovered: false });
  }

  $: if (isHovered)
    toolTipContent.update((x) => {
      x.content = content;
      return x;
    });
</script>

<div
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
  }
</style>
