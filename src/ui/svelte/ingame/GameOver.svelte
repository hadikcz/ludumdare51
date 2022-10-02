<script lang="ts">
    import GameScene, {GameOverStats} from "scenes/GameScene";
    import {Events} from "enums/Events";

    export let scene: GameScene;

    let visible = false;

    let gameOverStats!: GameOverStats = {
        timeElapsed: 0,
        totalChickens: 0,
        totalCoinsEarned: 0,
        totalEggs: 0
    };

    scene.events.on(Events.GAME_OVER, (gameOverStatsIn: GameOverStats) => {
        gameOverStats = gameOverStatsIn;
        visible = true;
    })
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
      .title {
        margin-top: 70px;
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
        text-align: center;
      }
    }

</style>

{#if visible}
    <div class="black-bg"></div>
    <div class="sprite big_modal">
        <div class="title">Game over</div>
        <div class="subtitle">All your chickens have died</div>
        <div class="dots">
            Elapsed time: {Math.round(gameOverStats.timeElapsed / 60)}min<br>
            Total chicken: {gameOverStats.totalChickens}<br>
            Total eggs: {gameOverStats.totalEggs}<br>
            Total coins earned: {gameOverStats.totalCoinsEarned}<br>
        </div>
    </div>
{/if}
