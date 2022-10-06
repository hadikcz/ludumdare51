import Image = Phaser.GameObjects.Image;
import { Depths } from 'enums/Depths';
import { Events } from 'enums/Events';
import NumberHelpers from 'helpers/NumberHelpers';
import { Subject } from 'rxjs';
import GameScene from 'scenes/GameScene';

export default class Well extends Image {


    public static readonly WELL_TRANSFER_VALUE = 5;
    public static readonly MAX_WELL_CAPACITY = 200;
    public amount$: Subject<number>;
    private timer: Phaser.Time.TimerEvent;

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

        this.timer = this.scene.time.addEvent({
            delay: 1000,
            repeat: Infinity,
            callbackScope: this,
            callback: () => {
                this.amount += 0.5;
                this.amount$.next(this.amount);
            }
        });

        this.setInteractive({ useHandCursor: true });

        this.on('pointerdown', () => {
            if (this.scene.input.activePointer.downElement.localName !== 'canvas') {
                return;
            }
            this.scene.events.emit(Events.UI_WELL_OPEN, this);
        });
    }

    preUpdate (): void {
        let pointer = this.scene.input.activePointer;
        let inBounds = this.getBounds().contains(pointer.worldX, pointer.worldY);

        if (inBounds) {
            this.setTint(0xFFFF00);
        } else {
            this.setTint(0xFFFFFF);
        }
    }

    getPercent (): number {
        return Math.round((this.amount / Well.MAX_WELL_CAPACITY) * 100);
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

    tryDestroy (): void {
        this.timer.destroy();
        this.destroy();
    }


}
