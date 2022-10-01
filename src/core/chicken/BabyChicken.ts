import AbstractChicken from 'core/chicken/AbstractChicken';
import { ChickenAnimations } from 'core/chicken/ChickenAnimations';
import AnimationHelpers from 'helpers/AnimationHelpers';
import NumberHelpers from 'helpers/NumberHelpers';
import GameScene from 'scenes/GameScene';

export default class BabyChicken extends AbstractChicken {

    constructor (public scene: GameScene, x: number, y: number) {
        super(scene, x, y, true);

        this.image = this.scene.add.sprite(0, 0, 'game', 'chicken_baby_static');
        this.add(this.image);

        this.scene.time.addEvent({
            delay: NumberHelpers.randomIntInRange(10000, 10000),
            callbackScope: this,
            callback: this.bornChicken
        });


        this.image.anims.create({
            key: ChickenAnimations.WALK,
            frames: this.scene.anims.generateFrameNumbers('chicken_baby', AnimationHelpers.getRangeAnimationObjectByRowAndLength(2, 4) ),
            frameRate: 15,
            repeat: Infinity
        });

        this.image.anims.create({
            key: ChickenAnimations.IDLING,
            frames: this.scene.anims.generateFrameNumbers('chicken_baby', AnimationHelpers.getRangeAnimationObjectByRowAndLength(3, 3) ),
            frameRate: 15,
            repeat: Infinity
        });

        this.image.anims.create({
            key: ChickenAnimations.EAT,
            frames: this.scene.anims.generateFrameNumbers('chicken_baby', { frames: [1, 2] } ),
            frameRate: 15,
            repeat: Infinity
        });

        this.image.play('eat');
    }

    preUpdate () {
        super.preUpdate(this.image);
    }

    private bornChicken (): void {
        this.scene.chickenManager.spawnChicken(this.x, this.y);
        this.destroy(true);
    }
}
