<script lang="ts">

    import ShopPurchaseButton from "ui/svelte/ingame/shop/ShopPurchaseButton.svelte";
    import GameScene from "scenes/GameScene";
    import {Buildings} from "core/builder/Buildings";
    import Shop from "core/Shop";


    export let scene: GameScene;

    let coins = scene.shop.coins;
    scene.shop.coins$.subscribe((value) => {
        coins = value;
    });

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


    }

</style>

<div class="wrapper sprite shop-shop_bg">
    <div class="items-wrapper">
        <ShopPurchaseButton events="{scene.events}" coins="{coins}" price="{Shop.FEEDER_PRICE_FOOD}" icon="feeder_food" type="{Buildings.FEEDER_FOOD}"></ShopPurchaseButton>
        <ShopPurchaseButton events="{scene.events}" coins="{coins}" price="{Shop.FEEDER_PRICE_WATER}" icon="feeder_water" type="{Buildings.FEEDER_WATER}"></ShopPurchaseButton>
        <ShopPurchaseButton events="{scene.events}" coins="{coins}" price="{Shop.CHICKEN_HOUSE_PRICE}" icon="chicken_house" type="{Buildings.CHICKEN_HOUSE}"></ShopPurchaseButton>
        <ShopPurchaseButton events="{scene.events}" coins="{coins}" price="{Shop.WELL_PRICE}" icon="well" type="{Buildings.WELL}" smallPriceSize="true"></ShopPurchaseButton>
    </div>
</div>
