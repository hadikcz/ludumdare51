import { GetRandomChickenType } from 'core/chicken/ChickenTypes';
import { Depths } from 'enums/Depths';
import GameScene from 'scenes/GameScene';

export default class Chicken extends Phaser.GameObjects.Container {

    private static readonly AMOUNT_OF_HUNGER_PER_CYCLE = 1;
    private static readonly AMOUNT_OF_THIRST_PER_CYCLE = 1;
    private image: Phaser.GameObjects.Image;

    private isDead: boolean = false;
    private hunger: number = 100;
    private thirst: number = 100;

    constructor (scene: GameScene, x: number, y: number) {
        super(scene, x, y, []);

        this.scene.add.existing(this);

        this.setDepth(Depths.CHICKEN);


        this.type = GetRandomChickenType();
        console.log(this.type);

        console.log('chicken_' + this.type + '_static');
        this.image = this.scene.add.image(0, 0, 'game', 'chicken_' + this.type + '_static');
        this.add(this.image);
    }

    preUpdate (): void {
        if (this.isDead) {
            return;
        }

        this.x += 0.2;

        if (this.hunger <= 0 || this.thirst <= 0) {
            this.die();
        }
    }

    cycle (): void {
        this.processHungerAndThirst();
    }

    every10Seconds (): void {
        this.spawnEgg();
    }

    private processHungerAndThirst (): void {
        this.hunger -= Chicken.AMOUNT_OF_HUNGER_PER_CYCLE;
        this.thirst -= Chicken.AMOUNT_OF_THIRST_PER_CYCLE;
    }

    private die (): void {
        this.destroy(true);
    }

    private spawnEgg (): void {
        this.scene.add.image(this.x, this.y, 'game', 'egg');
    }
}
