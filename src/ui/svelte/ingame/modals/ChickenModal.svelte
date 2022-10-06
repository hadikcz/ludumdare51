<script lang="ts">

    import GameScene from "scenes/GameScene";
    import {Events} from "enums/Events";
    import Feeder, {FeederType} from "core/feeders/Feeder";
    import {Subscription} from "rxjs";
    import Well from "core/buildings/Well";
    import Chicken from "core/chicken/Chicken";
    import AbstractChicken from "core/chicken/AbstractChicken";

    export let scene: GameScene;

    let visible = false;
    let lastAmountSubscriber: Subscription;
    let food = 100;
    let water = 100;

    let x = 250;
    let y = 250;

    let width = 150;
    let height = 174;
    let age = '';
    let eggs = 0;
    let isBaby = false;
    let chickenName = '';
    let onDieEvent: any;

    let lastChicken: AbstractChicken|null;


    let eggPrice = Chicken.BASIC_EGG_PRICE;


    scene.events.on(Events.CLOSE_ALL_MODALS, () => {
        close();
    });
    scene.events.on(Events.UI_CHICKEN_OPEN, (chicken: AbstractChicken) => {
        scene.events.emit(Events.CLOSE_ALL_MODALS);
        if (lastAmountSubscriber) {
            lastAmountSubscriber.unsubscribe();
        }
        lastChicken = chicken;
        age = chicken.getAge();

        let ageNum = parseFloat(age);
        eggPrice = Chicken.BASIC_EGG_PRICE / (1 + (ageNum / Chicken.AGE_MODIFIER));
        eggs = chicken.spawnedEggs;

        food = chicken.getFood();
        water = chicken.getWater();

        isBaby = chicken.isABaby();

        // lastAmountSubscriber = well.amount$.subscribe((value) => {
        //     progress = Math.round((value / Well.MAX_WELL_CAPACITY) * 100);
        // })

        chickenName = chicken.chickenName;

        x = lastChicken.x * 2 - (width / 2) + 3;
        y = lastChicken.y * 2 - height - 12

        visible = true;

        onDieEvent = function () {
            close();
        }

        chicken.once('destroy', onDieEvent);
    });


    function close() {
        if (lastAmountSubscriber) {
            lastAmountSubscriber.unsubscribe();
        }
        visible = false;
        if (lastChicken && onDieEvent) {
            lastChicken.removeListener(onDieEvent)
        }
        lastChicken = null;
    }

    function tryDestroy(): void {
        if (!lastChicken) return;

        lastChicken.tryKill();
        close();
    }
</script>

<style lang="scss">
    .well-modal {
      pointer-events: all;
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
        pointer-events: all;
        line-height: 17px;
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
          margin-top: -2px;
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
          font-size: 16px;
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

        .note {
          color: red;
          font-size: 10px;
          text-align: center;
          transform: translateY(-4px);
        }

      }

      .destroyWrapper {
        position: absolute;
        right: 7px;
        bottom: 55px;

      }

    }
</style>


{#if visible}
    <div class="well-modal" style="left: {x}px; top: {y}px;">
        <div class="sprite modals-feeder-close_button close" on:click|stopPropagation={close}></div>
        <div class="sprite modals-well-bg bg"></div>
        <div class="inside">
            <div class="title">
                {chickenName}
            </div>

            <div class="info">
                Food
            </div>
            <div class="progressBar sprite modals-feeder-progress_bar_bg">
                <div class="sprite modals-feeder-progress_bar_fill" style="width: {Math.max(0, food)}%;"></div>
            </div>
            <div class="progress">
                <!--{progress}%-->
            </div>


            <div class="info">
                Water
            </div>
            <div class="progressBar sprite modals-feeder-progress_bar_bg">
                <div class="sprite modals-feeder-progress_bar_fill water" style="width: {Math.max(0, water)}%;"></div>
            </div>
            <div class="progress">
                <!--{progress}%-->
            </div>

            <div class="info" style="text-align: left; margin-left: 15px;">
                Age: {age}min<br>
                {#if !isBaby}
                    Eggs: {eggs}<br>
                    Egg price: {eggPrice.toFixed(2)}
                {:else}
                    Is a baby
                {/if}
            </div>

            <div class="note">Not refresing</div>

            <div class="button-wrapper tooltip destroyWrapper" on:click|stopPropagation={tryDestroy}>
                <div class="button sprite modals-feeder-destroy_button"></div>
                <span class="tooltiptext">
                    Kill chicken
                </span>
            </div>

        </div>
    </div>
{/if}
