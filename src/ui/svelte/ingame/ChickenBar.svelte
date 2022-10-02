<script lang="ts">
    import GameScene from "scenes/GameScene";

    export let scene: GameScene;

    let chickens = scene.chickenManager.getChickenCount();
    let maxChicken = scene.chickenManager.getMaxChickenLimit();

    scene.chickenManager.chickensCount$.subscribe((value: number) => {
        chickens = value;
    });
    scene.chickenManager.maxChickenLimit$.subscribe((value: number) => {
        maxChicken = value;
    });
</script>

<style lang="scss">

      .value-wrapper {
        top: 3px;
        width: 94px;
        position: relative;
        text-align: center;
        font-size: 23px;
        color: #b68962;
        margin-left: 30px;
        overflow: hidden;
        word-spacing: 0.1px;
      }

      .value-wrapper.max {
        color: red;
      }

      .warn {    position: absolute;
        top: 34px;
        left: 113px;
        font-size: 11px;
        word-spacing: 2px;
        text-align: center;
        color: #713970;
        animation: fadein 1s;
      }

      @keyframes fadein {
        from { opacity: 0; }
        to   { opacity: 1; }
      }
</style>

<div class="sprite chicken_bar">
    <div class="value-wrapper {chickens > maxChicken ? 'max' : ''}">
        {chickens} / {maxChicken}
    </div>
    {#if chickens > maxChicken}
        <div class="sprite build_chicken_houses warn">Build chicken house</div>
    {/if}
</div>
