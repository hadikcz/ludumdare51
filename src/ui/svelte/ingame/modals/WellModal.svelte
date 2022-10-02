<script lang="ts">

    import GameScene from "scenes/GameScene";
    import {Events} from "enums/Events";
    import Feeder, {FeederType} from "core/feeders/Feeder";
    import {Subscription} from "rxjs";
    import Well from "core/buildings/Well";

    export let scene: GameScene;

    let visible = false;
    let lastAmountSubscriber: Subscription;
    let progress = 100;

    let x = 250;
    let y = 250;

    let width = 150;
    let height = 174;

    let lastWell: Well|null;


    scene.events.on(Events.UI_FEEDER_OPEN, () => {
        close();
    })
    scene.events.on(Events.UI_WELL_OPEN, (well: Well) => {
        if (lastAmountSubscriber) {
            lastAmountSubscriber.unsubscribe();
        }
        lastWell = well;
        progress = well.getPercent();

        lastAmountSubscriber = well.amount$.subscribe((value) => {
            progress = Math.round((value / Well.MAX_WELL_CAPACITY) * 100);
        })

        x = well.x * 2 - (width / 2) + 3;
        y = well.y * 2 - height - 12

        visible = true;
    });

    scene.events.on(Events.NEW_WELL_PURCHASED, () => {
        close();
    })

    function close() {
        if (lastAmountSubscriber) {
            lastAmountSubscriber.unsubscribe();
        }
        visible = false;
        lastWell = null;
    }

    function tryDestroy(): void {
        if (!lastWell) return;

        lastWell.tryDestroy();
        close();

    }
</script>

<style lang="scss">
    .well-modal {
      position: absolute;
      top: 50%;
      left: 50%;
      //width: 200px;
      //height: 200px;
      //transform: translate(-50%, -50%);

      .bg {
        z-index: 4999;

      }
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

      .inside {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;

        .title {
          margin-top: 5px;
          width: 100%;
          text-align: center;
          font-size: 25px;
          color: #b68962;
        }

        .progressBar {
          position: relative;
          margin-top: 5px;
          left: 50%;
          transform: translateX(-50%);
        }

        .progress {
          text-align: center;
          font-size: 20px;
          color: #b68962;
        }

        .modals-feeder-progress_bar_fill.water {
          filter: hue-rotate(113deg);
        }

        .info {
          font-size: 12px;
          word-spacing: 1px;
          color: #b68962;
          text-align: center;
        }
        .button {
          text-align: center;
          cursor: pointer;
          display: inline-block;
          transform: translateY(4px);
        }

        .button:hover {
          filter: sepia(1);
        }

        .buttons-wrapper {
          text-align: center;
        }

      }

    }
</style>


{#if visible}
    <div class="well-modal" style="left: {x}px; top: {y}px;">
        <div class="sprite modals-feeder-close_button close" on:click={close}></div>
        <div class="sprite modals-well-bg bg"></div>
        <div class="inside">
            <div class="title">
                Well
            </div>
            <div class="progressBar sprite modals-feeder-progress_bar_bg">
                <div class="sprite modals-feeder-progress_bar_fill water" style="width: {progress}%;"></div>
            </div>
            <div class="progress">
                {progress}%
            </div>
            <div class="info">
                Fill up 0.5 per second<br>
                Can be used to fill the drinker for free
            </div>


            <div class="buttons-wrapper">
                <div class="button-wrapper tooltip" on:click={tryDestroy}>
                    <div class="button sprite modals-feeder-destroy_button"></div>
                    <span class="tooltiptext">
                            Destroy
                        </span>
                </div>

            </div>

        </div>
    </div>
{/if}
