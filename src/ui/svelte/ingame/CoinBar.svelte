<script lang="ts">
    import GameScene from "scenes/GameScene";

    export let scene: GameScene;

    let coins = scene.shop.coins;
    let animate = false;

    scene.shop.coins$.subscribe((value: number) => {

        if (value > coins) {
           animate = true;
           setTimeout(() => {
               animate = false;
           }, 500)
        }
       coins = value;
    });

</script>

<style lang="scss">
      .coin-wrapper {
        left: 27px;
        top: 3px;
        width: 61px;
        position: relative;
        text-align: center;
        font-size: 23px;
        color: #b68962;
      }

      .icon {
        position: absolute !important;
        left: 9px !important;
        top: 6px;
      }

      .icon-pulse {
        animation-name: pulse;
        animation-duration: 0.4s;
        animation-timing-function: ease-out;
        animation-direction: alternate;
        //animation-iteration-count: infinite;
        animation-play-state: running;
      }

      @keyframes pulse {
        0% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.5);
        }
        100% {
          transform: scale(1.0);
        }
      }
</style>

    <div class="sprite empty_bar">
        <div class="sprite coin_bar_icon icon {animate ? 'icon-pulse' : ''}"></div>
        <div class="coin-wrapper">
            {coins}
        </div>
    </div>
