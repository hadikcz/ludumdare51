import GameScene from 'scenes/GameScene';

export default class Feeder extends Phaser.GameObjects.Image {


    private static readonly MAX_VALUE = 50;

    constructor (
        public scene: GameScene,
        x: number,
        y: number,
        private typeOf: FeederType,
        private amount: number = 5
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

        if (this.amount <= 50 && this.amount > 40) {
            image += 5;
        } else if (this.amount <= 40 && this.amount > 30) {
            image += 4;
        } else if (this.amount <= 30 && this.amount > 20) {
            image += 3;
        } else if (this.amount <= 20 && this.amount > 10) {
            image += 2;
        } else if (this.amount <= 10) {
            image += 1;
        }

        this.setFrame(image);
    }
}

export enum FeederType {
    FOOD,
    DRINK
}
