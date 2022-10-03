import AbstractChicken from 'core/chicken/AbstractChicken';
import { ChickenAnimations } from 'core/chicken/ChickenAnimations';
import AnimationHelpers from 'helpers/AnimationHelpers';
import NumberHelpers from 'helpers/NumberHelpers';
import GameScene from 'scenes/GameScene';

export default class BabyChicken extends AbstractChicken {

    constructor (public scene: GameScene, x: number, y: number, isHomeless: boolean = false, name: string) {
        super(scene, x, y, true, isHomeless, name);

        this.image = this.scene.add.sprite(0, 0, 'game', 'chicken_baby_static');
        this.add(this.image);

        this.scene.time.addEvent({
            delay: NumberHelpers.randomIntInRange(15000, 35000),
            callbackScope: this,
            callback: () => {
                if (this.scene !== undefined) {
                    this.bornChicken();
                }
            }
        });


        this.image.anims.create({
            key: ChickenAnimations.WALK,
            frames: this.scene.anims.generateFrameNumbers('chicken_baby', AnimationHelpers.getRangeAnimationObjectByRowAndLength(2, 4) ),
            frameRate: 15,
            repeat: Infinity
        });

        this.image.anims.create({
            key: ChickenAnimations.IDLING,
            frames: this.scene.anims.generateFrameNumbers('chicken_baby', { frames: [8, 9] } ),
            frameRate: NumberHelpers.randomFloatInRange(2, 3),
            repeat: Infinity
        });

        this.image.anims.create({
            key: ChickenAnimations.EAT,
            frames: this.scene.anims.generateFrameNumbers('chicken_baby', { frames: [1, 2] } ),
            frameRate: 10,
            repeat: Infinity
        });

        this.image.play(ChickenAnimations.IDLING);

        this.init();
    }

    preUpdate () {
        super.preUpdate(this.image);
    }

    private bornChicken (): void {
        if (this.scene === undefined) return;
        this.scene.chickenManager.spawnChicken(this.x, this.y, this.chickenName);
        this.destroy(true);
    }
}
