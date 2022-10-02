<script lang="ts">
    import GameScene from "scenes/GameScene";

    export let scene: GameScene;

    let chickens = scene.chickenManager.getBabyChickenCount();

    scene.chickenManager.babyChickensCount$.subscribe((value: number) => {
       chickens = value;
    });

</script>

<style lang="scss">

      .value-wrapper {
        left: 27px;
        top: 3px;
        width: 61px;
        position: relative;
        text-align: center;
        font-size: 23px;
        color: #b68962;
      }
</style>

    <div class="sprite baby_chicken_bar">
        <div class="value-wrapper">
            {chickens}
        </div>
    </div>
