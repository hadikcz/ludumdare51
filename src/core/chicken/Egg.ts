import Coin from 'core/Coin';
import { Depths } from 'enums/Depths';
import NumberHelpers from 'helpers/NumberHelpers';
import TransformHelpers from 'helpers/TransformHelpers';
import GameScene from 'scenes/GameScene';

export default class Egg extends Phaser.GameObjects.Image {

    private destroyed = false;
    private clickArea: Phaser.GameObjects.Arc;
    constructor (
        public scene: GameScene,
        x: number,
        y: number,
        private value: number = 1
    ) {
        super(scene, x, y, 'game', 'egg');

        this.scene.add.existing(this);

        this.setDepth(Depths.EGG);


        // longer delay
        // after that born small baby chicken, which will wait 30-60 seconds before be big
        this.scene.time.addEvent({
            delay: NumberHelpers.randomIntInRange(10000, 15000),
            callbackScope: this,
            callback: () => {
                if (this.destroyed) return;

                if (this.scene.chickenManager.isOverCapLimitVery()) {
                    this.scene.add.tween({
                        targets: this,
                        alpha: 0,
                        duration: 500,
                        onComplete: () => {
                            this.destroy(true);
                        }
                    });
                    // this.scene.effectManager.launchDeathSkull(this.x, this.y);
                } else {
                    this.emit('born');
                    this.destroy(true);
                }

            }
        });

        this.clickArea = this.scene.add.circle(this.x, this.y, 8, 0x000000, 0)
            .setDepth(Depths.EGG_CLICK);

        this.clickArea.setInteractive({ useHandCursor: true });

        this.clickArea.on('pointerdown', () => {
            this.pop();

            // this.scene.add.tween({
            //     targets: this,
            //     duration: 300,
            //     alpha: 0,
            //     onComplete: () => {
            //     }
            // });
        });
    }

    private pop (): void {
        if (this.scene.input.activePointer.downElement.localName !== 'canvas') {
            return;
        }
        new Coin(this.scene, this.x, this.y, this.value);
        // this.scene.shop.sellEgg();
        this.destroyed = true;
        this.destroy(true);
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

            if (this.scene.input.activePointer.leftButtonDown()) {
                this.pop();
            }
        } else {
            this.setFrame('egg');
        }
    }

    destroy (fromScene?: boolean) {
        this.clickArea.destroy(fromScene);
        super.destroy(fromScene);
    }
}
