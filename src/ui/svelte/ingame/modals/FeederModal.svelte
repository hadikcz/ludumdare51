<script lang="ts">

    import GameScene from "scenes/GameScene";
    import {Events} from "enums/Events";
    import Feeder, {FeederType} from "core/feeders/Feeder";
    import {Subscription} from "rxjs";
    import Well from "core/buildings/Well";

    export let scene: GameScene;
    export let coins: number;

    let visible = false;
    let lastAmountSubscriber: Subscription;
    let progress = 100;
    let waterAviaible = false;

    let maxFillPrice: number = 0;
    let onePiecePrice: number;

    let x = 250;
    let y = 250;

    let width = 238;
    let height = 154;

    let feederType: FeederType = FeederType.FOOD;


    $: onePiecePriceNormalized = Math.max(0, onePiecePrice);
    $: maxFillPriceNormalized = Math.max(0, maxFillPrice);

    let lastFeeder: Feeder|null;



    scene.events.on(Events.UI_WELL_OPEN, () => {
        close();
    })
    scene.events.on(Events.UI_FEEDER_OPEN, (feeder: Feeder) => {
        if (lastAmountSubscriber) {
            lastAmountSubscriber.unsubscribe();
        }
        lastFeeder = feeder;
        waterAviaible = feeder.getFeederTypeOf() === FeederType.DRINK;
        progress = feeder.getPercentageOfFill();

        feederType = feeder.getFeederTypeOf();

        maxFillPrice = feeder.getMaxFillUpPrice();
        onePiecePrice = feeder.getOnePiecePrice();

        lastAmountSubscriber = feeder.amount$.subscribe((value) => {
            progress = Math.round((value / Feeder.MAX_VALUE) * 100);
            maxFillPrice = feeder.getMaxFillUpPrice();
        })

        x = feeder.x * 2 - (width / 2) + 8;
        y = feeder.y * 2 - height - 12

        console.log([x,y]);

        visible = true;
    });

    let avaialbelWell: Well|null = null;
    setInterval(() => {
        avaialbelWell = scene.buildingManager.getFullestWell();
    }, 100);

    scene.events.on(Events.NEW_FEEDER_PURHCASED, () => {
        close();
    })

    function close() {
        if (lastAmountSubscriber) {
            lastAmountSubscriber.unsubscribe();
        }
        visible = false;
        lastFeeder = null;
    }


    function purchaseOnePiece(): void {
        if (!lastFeeder) return;

        scene.feederManager.purchaseFillForFeeder(lastFeeder);
    }

    function purchaseMax(): void {
        if (!lastFeeder) return;

        scene.feederManager.purchaseFillForFeederMax(lastFeeder);
    }

    function tryDestroy(): void {
        if (!lastFeeder) return;

        lastFeeder.tryDestroy();
        close();
        // scene.feederManager.purchaseFillForFeederMax(lastFeeder);
    }

    function tryWellFill(): void {
        if (!avaialbelWell) return;
        if (!lastFeeder) return;

        lastFeeder.feedFromWell(avaialbelWell)
    }
</script>

<style lang="scss">
    .feeder-modal {
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

        .buttons-row {
          margin-top: 15px;
          width: 100%;
          text-align: center;
        }
        .button-wrapper {
          display: inline-block;
        }

        .button {
          cursor: pointer;
          display: inline-block;
        }

        .button:hover {
          filter: sepia(1);
        }

        .coinTranslate {
          transform: translate(-5px,5px);
        }

        hr {
          margin-top: 6px;
          margin-bottom: -1px;
          background: #90625d;
          border-color: #b18984;
        }
        .price {
          font-size: 20px;
          display: inline-block;
        }

        .price.full {
          color: gray;
        }

        .price.notEngCoins {
          color: red;
        }

        .modals-feeder-progress_bar_fill.water {
          filter: hue-rotate(113deg);
        }
      }

    }
</style>


{#if visible}
    <div class="feeder-modal" style="left: {x}px; top: {y}px;">
        <div class="sprite modals-feeder-close_button close" on:click={close}></div>
        <div class="sprite modals-feeder-bg bg"></div>
        <div class="inside">
            <div class="title">
            {#if feederType === FeederType.FOOD}
                Food
            {:else}
                Water
            {/if}
            </div>
            <div class="progressBar sprite modals-feeder-progress_bar_bg">
                <div class="sprite modals-feeder-progress_bar_fill {feederType === FeederType.DRINK ? 'water' : 'food'}" style="width: {progress}%;"></div>
            </div>
            <div class="progress">
                {progress}%
            </div>

            <div class="buttons-row">
                <div class="button-wrapper tooltip" on:click={purchaseOnePiece}>
                    <div class="button sprite modals-feeder-plus_one_button"></div>
                    <span class="tooltiptext">
                        Purchase one bag of meal<br>
                        {#if progress >= 100}
                        <br>
                            FULL
                        {/if}
                        <hr>
                        <div class="price {progress >= 100 ? 'full' : ''} {onePiecePriceNormalized > coins ? 'notEngCoins' : ''}">{onePiecePriceNormalized.toFixed(2)}</div> <div class="sprite coin_bar_icon coinTranslate"></div>
                    </span>
                </div>


                <div class="button-wrapper tooltip"  on:click={purchaseMax}>
                    <div class="button sprite modals-feeder-max_button"></div>
                    <span class="tooltiptext">
                        Fill up with food<br>
                        {#if progress >= 100}
                        <br>
                            FULL
                        {/if}
                        <hr>
                        <div class="price {progress >= 100 ? 'full' : ''} {maxFillPriceNormalized > coins ? 'notEngCoins' : ''}">{maxFillPriceNormalized.toFixed(2)}</div> <div class="sprite coin_bar_icon coinTranslate"></div>
                    </span>
                </div>


                {#if waterAviaible}
                <div class="button-wrapper tooltip" on:click={tryWellFill}>
                    <div class="button sprite modals-feeder-well_button"></div>
                    <span class="tooltiptext">
                        Fill up from well<br>
                        {#if !avaialbelWell}
                            Well is not viable or not has enough water
                        {/if}
                        <hr>
                        <div class="price">FREE</div> <div class="sprite coin_bar_icon coinTranslate"></div>
                    </span>
                </div>
                {/if}


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
