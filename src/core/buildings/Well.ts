import Image = Phaser.GameObjects.Image;
import { Depths } from 'enums/Depths';
import NumberHelpers from 'helpers/NumberHelpers';
import { Subject } from 'rxjs';
import GameScene from 'scenes/GameScene';

export default class Well extends Image {


    public static readonly WELL_TRANSFER_VALUE = 5;
    public static readonly MAX_WELL_CAPACITY = 200;
    public amount$: Subject<number>;

    constructor (
        public scene: GameScene,
        x: number,
        y: number,
        private amount: number = NumberHelpers.randomIntInRange(50, 80)
    ) {
        super(scene, x, y, 'game', 'well');

        this.scene.add.existing(this);


        this.amount$ = new Subject<number>();


        this.setDepth(Depths.WELL);

        this.scene.time.addEvent({
            delay: 1000,
            repeat: Infinity,
            callbackScope: this,
            callback: () => {
                this.amount++;
                this.amount$.next(this.amount);
            }
        });
    }

    getWellAmount (): number {
        return this.amount;
    }

    canBeTakenFrom (): boolean {
        return this.amount >= Well.WELL_TRANSFER_VALUE;
    }

    takeFromWell (): number|false {
        if (!this.canBeTakenFrom()) {
            return false;
        }

        this.amount -= Well.WELL_TRANSFER_VALUE;

        this.amount$.next(this.amount);

        return Well.WELL_TRANSFER_VALUE;
    }


}
