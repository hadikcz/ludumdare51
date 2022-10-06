<script lang="ts">
    import {Buildings} from "core/builder/Buildings";
    import EventEmitter = Phaser.Events.EventEmitter;
    import {Events} from "enums/Events";

    export let events: EventEmitter
    export let coins: number;
    export let price: number;
    export let icon: string;
    export let type: Buildings;
    export let smallPriceSize: boolean = false;
    export let tooltip: string|null = null;

    function tryPurchase(): void {
        events.emit(Events.UI_SHOP_TRY_PURCHASE, type);
    }
</script>

<style lang="scss">
  .shop-item {
    margin-bottom: 5px;

    .price-row {
      margin-top: 3px;
    }
    .price {
      font-size: 20px;
      color: #ffd600;
      display: inline-block;
      transform: translate(9px, -4px);
      width: 22px;
      text-align: center;
      left: -5px;
      margin-left: -10px;
    }
      .purchase-button {
        cursor: pointer;
        display: block;
      }

        .purchase-button:hover {
          filter: sepia(1);
        }

      .purchase-button.notEnoughCoins {
        filter: grayscale(0.75);
      }

      .price.notEnoughCoins {
        color: #ff6060;
      }

    .price.small {
      font-size: 12px;
    }
  }
</style>

<div class="shop-item  {tooltip ? 'tooltip left' : ''}" style="border-bottom: none;">
    <div class="sprite shop-purchase_button_{icon} purchase-button {price > coins ? 'notEnoughCoins' : ''}" on:click|stopPropagation={tryPurchase}></div>
    <div class="price-row">
        <div class="price {price > coins ? 'notEnoughCoins' : ''} {smallPriceSize ? 'small' : ''}">
            {price}
        </div>
        <div class="sprite coin_bar_icon"></div>
        {#if tooltip}
            <span class="tooltiptext">
                {tooltip}
            </span>
        {/if}
    </div>
</div>
