import AbstractChicken from 'core/chicken/AbstractChicken';
import { ChickenTypes, GetRandomChickenType } from 'core/chicken/ChickenTypes';
import AnimationHelpers from 'helpers/AnimationHelpers';
import GameScene from 'scenes/GameScene';

export default class Chicken extends AbstractChicken {


    private image: Phaser.GameObjects.Sprite;
    private typeOfChicken: ChickenTypes;

    constructor (public scene: GameScene, x: number, y: number) {
        super(scene, x, y);


        this.typeOfChicken = GetRandomChickenType();

        this.image = this.scene.add.sprite(0, 0, 'game', 'chicken_' + this.typeOfChicken + '_static');
        this.add(this.image);



        this.image.anims.create({
            key: 'walk',
            frames: this.scene.anims.generateFrameNumbers('chicken_' + this.typeOfChicken, AnimationHelpers.getRangeAnimationObjectByRowAndLength(3, 4) ),
            frameRate: 15,
            repeat: Infinity,
        });

        this.image.play('walk');
    }

    preUpdate () {
        super.preUpdate(this.image);
    }

    every10Seconds (): void {
        this.spawnEgg();
    }

    private spawnEgg (): void {
        this.scene.eggManager.spawnEgg(this.x, this.y);
    }
}
