<script lang="ts">
    import GameScene from "scenes/GameScene";

    export let scene: GameScene;

    let chickens = scene.chickenManager.getChickenCount();
    let maxChicken = scene.chickenManager.getMaxChickenLimit();
    console.log(maxChicken);

    scene.chickenManager.chickensCount$.subscribe((value: number) => {
       chickens = value;
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
</style>

<div class="sprite chicken_bar">
    <div class="value-wrapper {chickens >= maxChicken ? 'max' : ''}">
        {chickens} / {maxChicken}
    </div>
</div>
