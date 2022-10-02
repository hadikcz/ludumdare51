import Coin from 'core/Coin';
import NumberHelpers from 'helpers/NumberHelpers';
import TransformHelpers from 'helpers/TransformHelpers';
import GameScene from 'scenes/GameScene';

export default class Egg extends Phaser.GameObjects.Image {

    private destroyed = false;
    constructor (
        public scene: GameScene,
        x: number,
        y: number
    ) {
        super(scene, x, y, 'game', 'egg');

        this.scene.add.existing(this);

        // longer delay
        // after that born small baby chicken, which will wait 30-60 seconds before be big
        this.scene.time.addEvent({
            delay: NumberHelpers.randomIntInRange(10000, 15000),
            callbackScope: this,
            callback: () => {
                if (this.destroyed) return;
                this.emit('born');

                this.destroy(true);
            }
        });

        this.setInteractive({ useHandCursor: true });

        this.on('pointerdown', () => {
            new Coin(this.scene, this.x, this.y, 1);
            // this.scene.shop.sellEgg();
            this.destroyed = true;
            this.destroy(true);

            // this.scene.add.tween({
            //     targets: this,
            //     duration: 300,
            //     alpha: 0,
            //     onComplete: () => {
            //     }
            // });
        });
    }

    preUpdate (): void {
        let pointer = this.scene.input.activePointer;

        if (TransformHelpers.getDistanceBetween(
            pointer.worldX,
            pointer.worldY,
            this.x,
            this.y
        ) <= 8) {
            this.setFrame('egg_selection');
        } else {
            this.setFrame('egg');
        }
    }
}
