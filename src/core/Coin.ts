import GameScene from 'scenes/GameScene';
import Image = Phaser.GameObjects.Image;
import { Depths } from 'enums/Depths';
import TransformHelpers from 'helpers/TransformHelpers';

export default class Coin extends Image {
    private shadow: Phaser.GameObjects.Image;

    constructor (
        public scene: GameScene,
        x: number,
        y: number,
        private value: number
    ) {
        super(scene, x, y, 'game', 'coin2_without_shadow');

        this.scene.add.existing(this);

        this.setDepth(Depths.COINS);

        this.setInteractive({ useHandCursor: true });
        this.shadow = this.scene.add.image(this.x, this.y + 2, 'game', 'coin2_shadow')
            .setOrigin(0.5, 0.5)
            .setDepth(Depths.COINS_SHADOW);


        let firstTime = 150;
        let secondTime = 1000;
        this.scene.tweens.add({
            targets: this.shadow,
            scale: 0.2,
            duration: firstTime,
            ease: Phaser.Math.Easing.Linear,
            onComplete: () => {
                this.scene.tweens.add({
                    targets: this.shadow,
                    scale: 1,
                    duration: secondTime,
                    ease: Phaser.Math.Easing.Bounce.Out,
                });
            }
        });

        this.scene.tweens.add({
            targets: this,
            y: this.y - 25,
            duration: firstTime,
            ease: Phaser.Math.Easing.Linear,
            onComplete: () => {
                this.scene.tweens.add({
                    targets: this,
                    y: this.y + 25,
                    duration: secondTime,
                    ease: Phaser.Math.Easing.Bounce.Out,
                });
            }
        });

        this.on('pointerdown', () => {
            this.shadow.destroy(true);

            this.scene.tweens.add({
                targets: this,
                x: 250,
                y: 15,
                duration: 500,
                ease: Phaser.Math.Easing.Expo.Out,
                onComplete: () => {
                    this.destroy(true);
                }
            });

        });

    }

    preUpdate (): void {
        let pointer = this.scene.input.activePointer;

        if (TransformHelpers.getDistanceBetween(
            pointer.worldX,
            pointer.worldY,
            this.x,
            this.y
        ) <= 10) {
            this.setFrame('coin2_selected');
        } else {
            this.setFrame('coin2_without_shadow');
        }
    }

    destroy (fromScene?: boolean) {
        this.scene.shop.sellEgg();
        super.destroy(fromScene);


        if (this.shadow) {
            this.shadow.destroy(true);
        }
    }
}
