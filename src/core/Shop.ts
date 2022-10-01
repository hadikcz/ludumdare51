import { Subject } from 'rxjs';
import GameScene from 'scenes/GameScene';

export default class Shop {

    public static readonly FEEDER_PRICE = 2;
    public static readonly FEEDER_FILL_PRICE = 1;
    public coins$: Subject<number>;

    constructor (
        private scene: GameScene,
        public coins: number = 0
    ) {
        this.coins$ = new Subject<number>();
    }

    sellEgg (): void {
        this.coins += 1;

        this.coins$.next(this.coins);
    }

    addCoins (amount: number): void {
        this.coins += Math.abs(amount);
        this.coins$.next(this.coins);
    }

    canPurchaseFeeder (): boolean {
        return this.coins >= Shop.FEEDER_PRICE;
    }

    canPurchaseFeederFill (): boolean {
        return this.coins >= Shop.FEEDER_FILL_PRICE;
    }

    purchaseFeeder (): void {
        this.coins -= Shop.FEEDER_PRICE;
        this.coins$.next(this.coins);
    }

    purchaseFeederFill (): void {
        this.coins -= Shop.FEEDER_FILL_PRICE;
        this.coins$.next(this.coins);
    }

}
