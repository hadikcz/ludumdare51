<script lang="ts">
    export let valueX: number;
    export let visible: boolean;
</script>

<style lang="scss">
    .example-bar {
      top: 10px;
      right: 25px;
      position: absolute;
      pointer-events: all;

      .inner {
        width: 300px;
        height: 20px;
        background: red;
      }
    }
</style>

{#if visible}
    <div class="example-bar">
        <div class="inner">
            {valueX}
        </div>
    </div>
{/if}
