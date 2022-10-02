import AbstractChicken from 'core/chicken/AbstractChicken';
import { ChickenAnimations } from 'core/chicken/ChickenAnimations';
import { ChickenTypes, GetRandomChickenType } from 'core/chicken/ChickenTypes';
import AnimationHelpers from 'helpers/AnimationHelpers';
import NumberHelpers from 'helpers/NumberHelpers';
import GameScene from 'scenes/GameScene';

export default class Chicken extends AbstractChicken {


    private typeOfChicken: ChickenTypes;

    constructor (public scene: GameScene, x: number, y: number, isHomeless: boolean = false, name: string) {
        super(scene, x, y, false, isHomeless, name);


        this.typeOfChicken = GetRandomChickenType();

        this.image = this.scene.add.sprite(0, 0, 'game', 'chicken_' + this.typeOfChicken + '_static');
        this.add(this.image);



        this.image.anims.create({
            key: ChickenAnimations.WALK,
            frames: this.scene.anims.generateFrameNumbers('chicken_' + this.typeOfChicken, AnimationHelpers.getRangeAnimationObjectByRowAndLength(3, 4) ),
            frameRate: 15,
            repeat: Infinity,
        });

        this.image.anims.create({
            key: ChickenAnimations.EAT,
            frames: this.scene.anims.generateFrameNumbers('chicken_' + this.typeOfChicken, { frames: [5, 6] } ),
            // frames: this.scene.anims.generateFrameNumbers('chicken_' + this.typeOfChicken, { frames: [4, 5, 6] } ),
            frameRate: 10,
            repeat: Infinity,
        });

        this.image.anims.create({
            key: ChickenAnimations.IDLING,
            frames: this.scene.anims.generateFrameNumbers('chicken_' + this.typeOfChicken, { frames: [12, 13] }),
            frameRate: NumberHelpers.randomFloatInRange(2, 3),
            repeat: Infinity,
        });

        this.image.anims.create({
            key: ChickenAnimations.IDLING_LOOKING,
            frames: this.scene.anims.generateFrameNumbers('chicken_' + this.typeOfChicken, AnimationHelpers.getRangeAnimationObjectByRowAndLength(1, 2) ),
            frameRate: NumberHelpers.randomFloatInRange(0.5, 1),
            repeat: Infinity,
        });

        this.init();
    }

    preUpdate () {
        super.preUpdate(this.image);
    }

    every10Seconds (): void {
        this.spawnEgg();
    }

    private spawnEgg (): void {
        if (this.isHomeless) return;

        this.scene.eggManager.spawnEgg(this.x, this.y);

        this.spawnedEggs++;
    }
}
