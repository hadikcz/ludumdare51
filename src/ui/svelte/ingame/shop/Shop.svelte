<script lang="ts">

    import ShopPurchaseButton from "ui/svelte/ingame/shop/ShopPurchaseButton.svelte";
    import GameScene from "scenes/GameScene";
    import {Buildings} from "core/builder/Buildings";
    import Shop from "core/Shop";
    import {FeederType} from "../../../../core/feeders/Feeder";


    export let scene: GameScene;

    let coins = scene.shop.coins;
    scene.shop.coins$.subscribe((value) => {
        coins = value;
    });


    let feederFoodPrice = scene.shop.getFeederPrice(FeederType.FOOD);
    let feederWaterPrice = scene.shop.getFeederPrice(FeederType.DRINK);
    let chickenHousePrice = scene.shop.getChickenHousePrice();
    setInterval(() => {
        feederFoodPrice = scene.shop.getFeederPrice(FeederType.FOOD);
        feederWaterPrice = scene.shop.getFeederPrice(FeederType.DRINK);
        chickenHousePrice = scene.shop.getChickenHousePrice();
    }, 500);

</script>

<style lang="scss">
    .wrapper {
      width: 100px;
      height: 354px;
      right: 5px;
      top: 50%;
      transform: translateY(-50%);
      position: absolute;

      .items-wrapper {
        margin-top: 20px;
        margin-left: 20px;
        right: 20px;
        position: absolute;
      }

      .shop-shop_bg {
        position: absolute;
        right: 0;
      }

    }
    .tooltip {
      border-bottom: 0!important; /* If you want dots under the hoverable text */
    }

</style>

<div class="wrapper">
    <div class="sprite shop-shop_bg"></div>
    <div class="items-wrapper">
        <ShopPurchaseButton
                events="{scene.events}"
                coins="{coins}"
                price="{feederFoodPrice}"
                icon="feeder_food"
                type="{Buildings.FEEDER_FOOD}"
                tooltip="Feeder with food"
        ></ShopPurchaseButton>
        <ShopPurchaseButton
                events="{scene.events}"
                coins="{coins}"
                price="{feederWaterPrice}"
                icon="feeder_water"
                type="{Buildings.FEEDER_WATER}"
                tooltip="Feeder with water"
        ></ShopPurchaseButton>
        <ShopPurchaseButton
                events="{scene.events}"
                coins="{coins}"
                price="{chickenHousePrice}"
                icon="chicken_house"
                type="{Buildings.CHICKEN_HOUSE}"
                smallPriceSize="{chickenHousePrice >= 100}"
                tooltip="Chicken house, increase limit of chicken by 10"
        ></ShopPurchaseButton>
        <ShopPurchaseButton
                events="{scene.events}"
                coins="{coins}"
                price="{Shop.WELL_PRICE}"
                icon="well"
                type="{Buildings.WELL}"
                smallPriceSize="true"
                tooltip="Well will provide you free water for feeder"
        ></ShopPurchaseButton>
    </div>
</div>
