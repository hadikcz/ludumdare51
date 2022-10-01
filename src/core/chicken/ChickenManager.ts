import Chicken from 'core/chicken/Chicken';
import Phaser from 'phaser';
import GameScene from 'scenes/GameScene';

export default class ChickenManager {

    private chickens: Phaser.GameObjects.Group;

    constructor (
        private scene: GameScene
    ) {

        this.chickens = this.scene.add.group();

        this.startTimers();

        this.spawnChicken(300, 300);
    }

    spawnChicken (x: number, y: number): void {
        const chicken = new Chicken(this.scene, x, y);
        this.chickens.add(chicken);
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
