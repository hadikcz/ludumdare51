<script lang="ts">

</script>

<style lang="scss">
    .wrapper {
      right: 5px;
      top: 50%;
      transform: translateY(-50%);
      position: absolute;

      .items-wrapper {
        margin-top: 20px;
        margin-left: 20px;
      }

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
        }
      }
      .purchase-button {
        cursor: pointer;
        display: block;
      }
    }

</style>

<div class="wrapper sprite shop-shop_bg">
    <div class="items-wrapper">
        <div class="shop-item">
            <div class="sprite shop-purchase_button_feeder_food purchase-button"></div>
            <div class="price-row">
                <div class="price">5</div> <div class="sprite coin_bar_icon"></div>
            </div>
        </div>
        <div class="shop-item">
            <div class="sprite shop-purchase_button_feeder_water purchase-button"></div>
            <div class="price-row">
                <div class="price">5</div> <div class="sprite coin_bar_icon"></div>
            </div>
        </div>
        <div class="shop-item">
            <div class="sprite shop-purchase_button_chicken_house purchase-button"></div>
            <div class="price-row">
                <div class="price">5</div> <div class="sprite coin_bar_icon"></div>
            </div>
        </div>
        <div class="shop-item">
            <div class="sprite shop-purchase_button_well purchase-button"></div>
            <div class="price-row">
                <div class="price">5</div> <div class="sprite coin_bar_icon"></div>
            </div>
        </div>
    </div>
</div>
