import AbstractChicken from 'core/chicken/AbstractChicken';
import AnimationHelpers from 'helpers/AnimationHelpers';
import NumberHelpers from 'helpers/NumberHelpers';
import GameScene from 'scenes/GameScene';

export default class BabyChicken extends AbstractChicken {
    private image: Phaser.GameObjects.Sprite;

    constructor (public scene: GameScene, x: number, y: number) {
        super(scene, x, y);



        this.image = this.scene.add.sprite(0, 0, 'game', 'chicken_baby_static');
        this.add(this.image);

        this.scene.time.addEvent({
            delay: NumberHelpers.randomIntInRange(10000, 10000),
            callbackScope: this,
            callback: this.bornChicken
        });


        this.image.anims.create({
            key: 'walk',
            frames: this.scene.anims.generateFrameNumbers('chicken_baby', AnimationHelpers.getRangeAnimationObjectByRowAndLength(2, 4) ),
            frameRate: 15,
            repeat: Infinity
        });

        this.image.play('walk');
    }

    preUpdate () {
        super.preUpdate(this.image);
    }

    private bornChicken (): void {
        this.scene.chickenManager.spawnChicken(this.x, this.y);
        this.destroy(true);
    }
}
