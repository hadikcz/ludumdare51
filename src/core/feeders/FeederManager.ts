import Feeder, { FeederType } from 'core/feeders/Feeder';
import Shop from 'core/Shop';
import ArrayHelpers from 'helpers/ArrayHelpers';
import TransformHelpers from 'helpers/TransformHelpers';
import GameScene from 'scenes/GameScene';
import { Vec2 } from 'types/Vec2';

export default class FeederManager {
    public readonly feeders: Phaser.GameObjects.Group;

    constructor (
        public scene: GameScene,
        private shop: Shop
    ) {

        this.feeders = this.scene.add.group();
    }

    purchaseFeeder (x: number, y: number, type: FeederType): void {
        if (!this.shop.canPurchaseFeeder(type)) {
            console.info('Can not purchase feeder, because coins');
            return;
        }

        let feeder = new Feeder(this.scene, x, y, type);
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

    getNearestFeederSlot (x: number, y: number, feederType: FeederType): {feeder: Feeder, slot: Vec2}|null {
        let nearestFeeder = ArrayHelpers.findLowest<Feeder>(
            // @ts-ignore
            this.feeders.getChildren().filter((feeder: Feeder) => {
                return feeder.getFeederTypeOf() === feederType;
            }), (feeder: Feeder) => {
                return TransformHelpers.getDistanceBetween(feeder.x, feeder.y, x, y);
            });

        if (!nearestFeeder) {
            return null;
        }

        let nearestSlot = nearestFeeder.getNearestSlot(x, y);
        if (!nearestSlot) {
            return null;
        }
        return {
            feeder: nearestFeeder,
            slot: {
                x: nearestSlot.x,
                y: nearestSlot.y
            }
        };
    }
}
