import BabyChicken from 'core/chicken/BabyChicken';
import Chicken from 'core/chicken/Chicken';
import Phaser from 'phaser';
import GameScene from 'scenes/GameScene';

export default class ChickenManager {

    private chickens: Phaser.GameObjects.Group;
    private babyChickens: Phaser.GameObjects.Group;

    constructor (
        private scene: GameScene
    ) {

        this.chickens = this.scene.add.group();
        this.babyChickens = this.scene.add.group();

        this.startTimers();

        this.spawnChicken(300, 300);
    }

    spawnChicken (x: number, y: number): void {
        const chicken = new Chicken(this.scene, x, y);
        this.chickens.add(chicken);
    }

    spawnBabyChicken (x: number, y: number): void {
        const babyChicken = new BabyChicken(this.scene, x, y);
        this.babyChickens.add(babyChicken);
    }

    private startTimers (): void {
        this.scene.time.addEvent({
            repeat: Infinity,
            delay: 1000,
            callbackScope: this,
            callback: () => {
                // @ts-ignore
                this.chickens.getChildren().forEach((chicken: Chicken) => {
                    chicken.cycle();
                });
                // @ts-ignore
                this.babyChickens.getChildren().forEach((chicken: BabyChicken) => {
                    chicken.cycle();
                });
            }
        });

        this.scene.time.addEvent({
            repeat: Infinity,
            delay: 10000,
            callbackScope: this,
            callback: () => {
                // @ts-ignore
                this.chickens.getChildren().forEach((chicken: Chicken) => {
                    chicken.every10Seconds();
                });
            }
        });

    }
}
