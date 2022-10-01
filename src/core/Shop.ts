import { Events } from 'enums/Events';
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


        this.coins$.subscribe((v) => {
            console.log(v);
        });
    }

    sellEgg (): void {
        this.coins += 1;

        this.coins$.next(this.coins);

        this.scene.events.emit(Events.COINS_UPDATED);
    }

    canPurchaseFeeder (): boolean {
        return this.coins >= Shop.FEEDER_PRICE;
    }

    canPurchaseFeederFill (): boolean {
        return this.coins >= Shop.FEEDER_FILL_PRICE;
    }

    purchaseFeeder (): void {
        this.coins -= Shop.FEEDER_PRICE;
        this.scene.events.emit(Events.COINS_UPDATED);
    }

    purchaseFeederFill (): void {
        this.coins -= Shop.FEEDER_FILL_PRICE;
        this.scene.events.emit(Events.COINS_UPDATED);
    }

}
