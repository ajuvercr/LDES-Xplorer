<script lang="ts">
  let isHovered = false;
  let h: number;
  let w: number;
  let tw: number;

  function mouseEnter() {
    isHovered = true;
  }

  function mouseOver() {
    isHovered = true;
  }
  function mouseLeave() {
    isHovered = false;
  }

  $: ev = isHovered ? "auto" : "none";
</script>

<div
  on:focus={mouseEnter}
  on:mouseover={mouseOver}
  on:mouseleave={mouseLeave}
  bind:clientWidth={w}
  bind:clientHeight={h}
  class="tooltip-wrapper"
>
  <slot />
  <div
    style="top: {h}px; left: {Math.max(
      w / 2 - tw / 2,
      0
    )}px; opacity: {isHovered ? 1.0 : 0}; pointer-events: {ev} "
    bind:clientWidth={tw}
    class="tooltip"
  >
    <slot name="tip">Some tipe</slot>
  </div>
</div>

<style>
  .tooltip-wrapper {
    position: relative;
    display: inline-block;
  }
  .tooltip {
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
  }
</style>
