import { Buildings } from 'core/builder/Buildings';
import { FeederType } from 'core/feeders/Feeder';
import { Events } from 'enums/Events';
import { Subject } from 'rxjs';
import GameScene from 'scenes/GameScene';

export default class Shop {

    public static readonly FEEDER_PRICE_FOOD = 4;
    public static readonly FEEDER_PRICE_WATER = 8;
    public static readonly FEEDER_FILL_PRICE_FOOD = 0.1;
    public static readonly FEEDER_FILL_PRICE_WATER = 0.2;
    public static readonly CHICKEN_HOUSE_PRICE = 35;
    public static readonly WELL_PRICE = 100;
    public coins$: Subject<number>;
    public coinsEarned = 0;

    constructor (
        private scene: GameScene,
        public coins: number = 0
    ) {
        this.coins$ = new Subject<number>();

        this.scene.events.on(Events.UI_SHOP_TRY_PURCHASE, this.uiTryPurchase.bind(this));
    }

    sellEgg (value: number): void {
        this.coins += value;

        this.coins$.next(this.coins);


        this.coinsEarned += 1;
    }

    addCoins (amount: number): void {
        this.coins += Math.abs(amount);
        this.coins$.next(this.coins);
    }

    canPurchaseFeeder (type: FeederType): boolean {
        if (type === FeederType.FOOD) {
            return this.canPurchaseFeederFood();
        } else {
            return this.canPurchaseFeederWater();
        }
    }

    getFeederPrice (type: FeederType): number {
        if (type === FeederType.FOOD) {
            return Math.max(1, this.scene.feederManager.feeders.getChildren().length) * Shop.FEEDER_PRICE_FOOD;
        } else {
            return Math.max(1, this.scene.feederManager.feeders.getChildren().length) * Shop.FEEDER_PRICE_WATER;
        }
    }

    canPurchaseFeederFood (): boolean {
        return this.coins >= this.getFeederPrice(FeederType.FOOD);
    }

    canPurchaseFeederWater (): boolean {
        return this.coins >= this.getFeederPrice(FeederType.DRINK);
    }

    canPurchaseChickenHouse (): boolean {
        return this.coins >= this.getChickenHousePrice();
    }

    getChickenHousePrice (): number {
        return Math.max(
            Shop.CHICKEN_HOUSE_PRICE,
            Shop.CHICKEN_HOUSE_PRICE * (this.scene.buildingManager.chickenHouses.getChildren().length + 1)
        );
    }

    canPurhcaseWell (): boolean {
        return this.coins >= Shop.WELL_PRICE;
    }

    purchaseFeeder (price: number): void {
        this.coins -= price;
        this.coins$.next(this.coins);
    }

    purchaseChickenHouse (): void {
        this.coins -= this.getChickenHousePrice();
        this.coins$.next(this.coins);
    }

    purchaseWell (): void {
        this.coins -= Shop.WELL_PRICE;
        this.coins$.next(this.coins);
    }


    private uiTryPurchase (building: Buildings) {
        switch (building) {
            case Buildings.FEEDER_FOOD:
                if (!this.canPurchaseFeederFood()) {
                    return false;
                }
                break;
            case Buildings.FEEDER_WATER:
                if (!this.canPurchaseFeederWater()) {
                    return false;
                }
                break;
            case Buildings.WELL:
                if (!this.canPurhcaseWell()) {
                    return false;
                }
                break;
            case Buildings.CHICKEN_HOUSE:
                if (!this.canPurchaseChickenHouse()) {
                    return false;
                }
                break;
        }

        // @TODO: CHECK if can pruchase it (coins);
        this.scene.builder.startBuild(building);
    }

}
