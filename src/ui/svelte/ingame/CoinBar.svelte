<script lang="ts">
    import GameScene from "scenes/GameScene";

    export let scene: GameScene;

    let coins = scene.shop.coins;

    scene.shop.coins$.subscribe((value: number) => {
       coins = value;
    });

</script>

<style lang="scss">
    .wrapper {
      top: 5px;
      left: 50%;
      transform: translateX(-50%);
      color: white;
      font-size: 25px;
      position: absolute;

    }
</style>

<div class="wrapper">
    Coins: {coins}
</div>
