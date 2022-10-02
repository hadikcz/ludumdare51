import { Buildings } from 'core/builder/Buildings';
import { FeederType } from 'core/feeders/Feeder';
import { Events } from 'enums/Events';
import { Subject } from 'rxjs';
import GameScene from 'scenes/GameScene';

export default class Shop {

    public static readonly FEEDER_PRICE_FOOD = 2;
    public static readonly FEEDER_FILL_PRICE = 1;
    public static readonly FEEDER_PRICE_WATER = 4;
    public static readonly CHICKEN_HOUSE_PRICE = 50;
    public static readonly WELL_PRICE = 100;
    public coins$: Subject<number>;

    constructor (
        private scene: GameScene,
        public coins: number = 0
    ) {
        this.coins$ = new Subject<number>();

        this.scene.events.on(Events.UI_SHOP_TRY_PURCHASE, this.uiTryPurchase.bind(this));
    }

    sellEgg (): void {
        this.coins += 1;

        this.coins$.next(this.coins);
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
            return Shop.FEEDER_PRICE_FOOD;
        } else {
            return Shop.FEEDER_PRICE_WATER;
        }
    }

    canPurchaseFeederFood (): boolean {
        return this.coins >= Shop.FEEDER_PRICE_FOOD;
    }

    canPurchaseFeederWater (): boolean {
        return this.coins >= Shop.FEEDER_PRICE_WATER;
    }

    canPurchaseFeederFill (): boolean {
        return this.coins >= Shop.FEEDER_FILL_PRICE;
    }

    canPurchaseChickenHouse (): boolean {
        return this.coins >= Shop.CHICKEN_HOUSE_PRICE;
    }

    purchaseFeeder (price: number): void {
        this.coins -= price;
        this.coins$.next(this.coins);
    }

    purchaseChickenHouse (): void {
        this.coins -= Shop.CHICKEN_HOUSE_PRICE;
        this.coins$.next(this.coins);
    }

    purchaseFeederFill (): void {
        this.coins -= Shop.FEEDER_FILL_PRICE;
        this.coins$.next(this.coins);
    }

    private uiTryPurchase (building: Buildings) {

        // @TODO: CHECK if can pruchase it (coins);
        this.scene.builder.startBuild(building);
    }

}
