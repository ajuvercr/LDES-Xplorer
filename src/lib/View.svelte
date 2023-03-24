<script lang="ts">
  export let ldes: string;
  export let view: string;
  export let url: string;
</script>

<div>
  For {ldes} view <a href="/ldes/{encodeURIComponent(url)}">{view}</a>
</div>
