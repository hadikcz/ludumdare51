import Feeder, { FeederType } from 'core/feeders/Feeder';
import Shop from 'core/Shop';
import GameScene from 'scenes/GameScene';

export default class FeederManager {
    private feeders: Phaser.GameObjects.Group;
    private shop: Shop;

    constructor (
        public scene: GameScene
    ) {

        this.shop = scene.shop;
        this.feeders = this.scene.add.group();


        // new Feeder(this, 100, 100, FeederType.FOOD, 23);
    }

    purchaseFeeder (x: number, y: number, type: FeederType): void {
        if (!this.shop.canPurchaseFeeder()) {
            console.info('Can not purchase feeder, because coins');
            return;
        }

        let feeder = new Feeder(this.scene, x, y, type, 0);
        this.feeders.add(feeder);

        this.shop.purchaseFeeder();
    }

    purchaseFillForFeeder (feeder: Feeder): void {
        if (!this.shop.canPurchaseFeederFill()) {

            console.info('Can not purchase feeder fill, because coins');
            return;
        }

        if (!feeder.canPurchaseFill()) {
            console.info('Can not purchase feeder fill, because it is full.');

            return;
        }

        feeder.purchaseFill();
        this.shop.purchaseFeeder();
    }
}
