import AbstractChicken from 'core/chicken/AbstractChicken';
import { ChickenTypes, GetRandomChickenType } from 'core/chicken/ChickenTypes';
import GameScene from 'scenes/GameScene';

export default class Chicken extends AbstractChicken {


    private image: Phaser.GameObjects.Image;
    private typeOfChicken: ChickenTypes;

    constructor (public scene: GameScene, x: number, y: number) {
        super(scene, x, y);


        this.typeOfChicken = GetRandomChickenType();

        this.image = this.scene.add.image(0, 0, 'game', 'chicken_' + this.typeOfChicken + '_static');
        this.add(this.image);
    }

    every10Seconds (): void {
        this.spawnEgg();
    }

    private spawnEgg (): void {
        this.scene.eggManager.spawnEgg(this.x, this.y);
    }
}
