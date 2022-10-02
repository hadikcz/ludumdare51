import EffectManager from 'effects/EffectManager';
import { Depths } from 'enums/Depths';
import Phaser from 'phaser';

export default class DeathSkull extends Phaser.GameObjects.Image {
    constructor (scene) {
        super(scene, EffectManager.DEFAULT_POSITION[0], EffectManager.DEFAULT_POSITION[1], 'game', 'ui/death_skull');

        this.scene.add.existing(this);

        this.setDepth(Depths.DEATH_SKULL);
        this.setActive(false);
        this.setVisible(false);
    }

    launch (x: number, y: number): void {
        this.setPosition(x, y);
        this.setVisible(true);
        this.setActive(true);
        this.setAlpha(1);

        let range = 20;
        let tweenX = Phaser.Math.RND.realInRange(-range, range);
        let tweenY = -50;
        let duration = Phaser.Math.RND.integerInRange(3000, 4000);

        this.scene.tweens.add({
            targets: this,
            x: this.x + tweenX,
            y: this.y + tweenY,
            alpha: 0,
            duration: duration,
            ease: 'Linear',
            onComplete: () => {
                this.setActive(false);
                this.setVisible(false);
            }
        });
    }
}
