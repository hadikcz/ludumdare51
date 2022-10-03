<script lang="ts">
    import GameScene from "scenes/GameScene";
    import {Events} from "enums/Events";

    export let scene: GameScene;

    let visible = true;

    function play(): void {

        visible = false;
        scene.events.emit(Events.WELCOME_CLOSED)
    }
</script>

<style lang="scss">
    .black-bg {
      width: 100%;
      height: 100%;
      background: #000000;
      opacity: 0.5;
      position: absolute;
    }
    .big_modal {
      pointer-events: all;
      position: absolute;
      z-index: 999999;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    color: #b68962;

      .close {
        position: absolute;
        top: -10px;
        left: -10px;
        cursor: pointer;
        z-index: 5000;
      }
      .close:hover {
        filter: sepia(1);
      }

      .title {
        margin-top: 10px;
        text-align: center;
        font-size: 25px;
      }

      .subtitle {
        text-align: center;font-size: 15px;
        color: #846041;
      }

      .dots {
        margin-top: 30px;
        color: #b68962;
        font-size: 15px;
      }

      .play {
        bottom: 15px;
        left: 50%;
        transform: translateX(-50%);
        font-size: 35px;
        color: #846041;
        text-align: center;
        filter: hue-rotate(45deg);
        position: absolute;
        cursor: pointer;
      }
      .text-inside {
        margin-top: 4px;
      }
    }

</style>

{#if visible}
    <div class="black-bg"></div>
    <div class="sprite big_modal">
        <div class="title">How to play</div>
        <div class="subtitle">Every 10 seconds the hen lays an egg.</div>
        <div class="dots">

        <ul>
            <li>1. Sell eggs by clicking on them</li>
            <li>2. Purchase feeder for keep them alive</li>
            <li>3. Purchase hen house for increase capacity</li>
            <li>4. Refill feeder with water and food</li>
            <li style="color: #ffff68">PRO TIP: The older the hen, the less value the eggs have. Kill the oldest</li>
        </ul>
        </div>

        <div class="sprite modals-building_mode_bg play" on:click={play}>
            <div class="text-inside">PLAY</div>
        </div>
    </div>
{/if}
