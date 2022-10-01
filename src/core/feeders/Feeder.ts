import { IBuildingBounds } from 'core/builder/IBuildingBounds';
import GameScene from 'scenes/GameScene';

export default class Feeder extends Phaser.GameObjects.Image implements IBuildingBounds {


    private static readonly MAX_VALUE = 50;

    constructor (
        public scene: GameScene,
        x: number,
        y: number,
        private typeOf: FeederType,
        private amount: number = 15
    ) {
        super(scene, x, y, 'game', 'feeder_water_1');

        this.scene.add.existing(this);

        this.detectAndSetImage();
    }

    purchaseFill (): void {
        if (!this.canPurchaseFill()) {
            return;
        }
        this.amount += 5;
    }

    canPurchaseFill (): boolean {
        return this.amount < Feeder.MAX_VALUE;
    }

    private detectAndSetImage (): void {
        let image;

        if (this.typeOf === FeederType.FOOD) {
            image = 'feeder_food_';
        } else {
            image = 'feeder_water_';
        }

        if (this.amount <= 50 && this.amount > 37.5) {
            image += 5;
        } else if (this.amount <= 37.5 && this.amount > 25) {
            image += 4;
        } else if (this.amount <= 25 && this.amount > 12.5) {
            image += 3;
        } else if (this.amount <= 12.5 && this.amount > 0) {
            image += 2;
        } else if (this.amount <= 0) {
            image += 1;
        }

        this.setFrame(image);
    }

    getImageBounds (): Phaser.Geom.Rectangle {
        return this.getBounds();
    }
}

export enum FeederType {
    FOOD = 'food',
    DRINK = 'drink'
}
