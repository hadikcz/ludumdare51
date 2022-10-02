import BabyChicken from 'core/chicken/BabyChicken';
import Chicken from 'core/chicken/Chicken';
import Phaser from 'phaser';
import { Subject } from 'rxjs';
import GameScene from 'scenes/GameScene';

export default class ChickenManager {

    private chickens: Phaser.GameObjects.Group;
    private babyChickens: Phaser.GameObjects.Group;
    public readonly chickensCount$: Subject<number>;
    public readonly babyChickensCount$: Subject<number>;

    constructor (
        private scene: GameScene
    ) {
        this.chickens = this.scene.add.group();
        this.babyChickens = this.scene.add.group();

        this.chickensCount$ = new Subject<number>();
        this.babyChickensCount$ = new Subject<number>();

        this.startTimers();

        this.spawnChicken(300, 300);

        this.chickens.on;
    }

    spawnChicken (x: number, y: number): void {
        const chicken = new Chicken(this.scene, x, y);
        chicken.on('destroy', () => {
            this.chickensCount$.next(this.getChickenCount());
        });
        this.chickens.add(chicken);

        this.chickensCount$.next(this.getChickenCount());
    }

    spawnBabyChicken (x: number, y: number): void {
        const babyChicken = new BabyChicken(this.scene, x, y);
        babyChicken.on('destroy', () => {
            this.babyChickensCount$.next(this.getBabyChickenCount());
        });
        this.babyChickens.add(babyChicken);
        this.babyChickensCount$.next(this.getBabyChickenCount());
    }

    getChickenCount (): number {
        return this.chickens.getChildren().length;
    }

    getBabyChickenCount (): number {
        return this.babyChickens.getChildren().length;
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
