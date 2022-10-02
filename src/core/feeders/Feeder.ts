import { IBuildingBounds } from 'core/builder/IBuildingBounds';
import Well from 'core/buildings/Well';
import Shop from 'core/Shop';
import { Depths } from 'enums/Depths';
import { Events } from 'enums/Events';
import ArrayHelpers from 'helpers/ArrayHelpers';
import NumberHelpers from 'helpers/NumberHelpers';
import TransformHelpers from 'helpers/TransformHelpers';
import { Subject } from 'rxjs';
import GameScene from 'scenes/GameScene';
import { Vec2 } from 'types/Vec2';

export default class Feeder extends Phaser.GameObjects.Image implements IBuildingBounds {


    public static readonly MAX_VALUE = 50;
    public readonly amount$: Subject<number>;
    private slots: FeederSlot[] = [];

    constructor (
        public scene: GameScene,
        x: number,
        y: number,
        private typeOf: FeederType,
        // private amount: number = Feeder.MAX_VALUE
        private amount: number = NumberHelpers.randomIntInRange(25, 35)
    ) {
        super(scene, x, y, 'game', 'feeder_water_1');

        this.scene.add.existing(this);


        this.amount$ = new Subject<number>();
        this.amount$.next(this.amount);

        this.setDepth(Depths.FEEDER);

        this.setInteractive({ useHandCursor: true });
        this.detectAndSetImage();
        this.generateFeedingSlots();

        this.setInteractive({ useHandCursor: true });

        this.on('pointerdown', () => {
            this.scene.events.emit(Events.UI_FEEDER_OPEN, this);
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

    purchaseFill (max: boolean = false): void {
        if (!this.canPurchaseFill()) {
            return;
        }

        if (max) {
            this.amount = JSON.parse(JSON.stringify(Feeder.MAX_VALUE));
        } else {
            this.amount += 5;
            if (this.amount > Feeder.MAX_VALUE) {
                this.amount = JSON.parse(JSON.stringify(Feeder.MAX_VALUE));
            }
        }

        this.detectAndSetImage();

        this.amount$.next(this.amount);
    }

    feedFromWell (well: Well): void {
        if (!this.canPurchaseFill()) return;
        if (this.typeOf !== FeederType.DRINK) return;

        let amount = well.takeFromWell();

        if (!amount) return;

        this.amount += amount;
        if (this.amount > Feeder.MAX_VALUE) {
            this.amount = JSON.parse(JSON.stringify(Feeder.MAX_VALUE));
        }
        this.detectAndSetImage();

        this.amount$.next(this.amount);
    }

    getPercentageOfFill (): number {
        return Math.round((this.amount / Feeder.MAX_VALUE) * 100);
    }

    canPurchaseFill (): boolean {
        return this.amount <= Feeder.MAX_VALUE;
    }


    getMaxFillUpPrice (): number {
        let missing = Feeder.MAX_VALUE - this.amount;

        if (this.typeOf === FeederType.DRINK) {
            return missing * Shop.FEEDER_PRICE_WATER;
        }
        return missing * Shop.FEEDER_PRICE_FOOD;
    }

    getOnePiecePrice (): number {
        if (this.typeOf === FeederType.DRINK) {
            return Shop.FEEDER_PRICE_WATER;
        }
        return Shop.FEEDER_PRICE_FOOD;
    }

    tryEat (): boolean {
        if (this.amount >= 1) {
            this.amount--;
            this.amount$.next(this.amount);
            this.detectAndSetImage();
            return true;
        }

        return false;
    }

    private detectAndSetImage (): void {
        let image;

        if (this.typeOf === FeederType.FOOD) {
            image = 'feeder_food_';
        } else {
            image = 'feeder_water_';
        }

        // if (this.amount <= 50 && this.amount > 37.5) {
        if (this.amount > 37.5) {
            image += 5;
        } else if (this.amount <= 37.5 && this.amount > 25) {
            image += 4;
        } else if (this.amount <= 25 && this.amount > 12.5) {
            image += 3;
        } else if (this.amount <= 12.5 && this.amount > 0) {
            image += 2;
        } else if (this.amount <= 0) {
            image += 1;
        }

        this.setFrame(image);
    }

    getImageBounds (): Phaser.Geom.Rectangle {
        return this.getBounds();
    }

    getNearestSlot (x: number, y: number): Vec2|null {
        // @TODO go to free slot, not random whcih could be occupied (for now skipping because it takes time)
        let nearestSlot = ArrayHelpers.findLowest<FeederSlot>(this.slots, (slot: FeederSlot) => {
            return TransformHelpers.getDistanceBetween(slot.x, slot.y, x, y);
        });

        if (nearestSlot) {
            return {
                x: nearestSlot.x,
                y: nearestSlot.y
            };
        }

        return null;
    }

    getFeederTypeOf (): FeederType {
        return this.typeOf;
    }

    private generateFeedingSlots (): void {
        let topOffset = 2;
        let bottomOffset = -2;
        let widthPart = 13;
        let widthOffset = 6;
        let height = 22;
        this.slots = [
            { // top left 1st
                x: this.x + ((-widthPart * 2) + widthOffset),
                y: this.y + (-height / 2 + topOffset),
                occupied: false
            },
            // top left 2nd
            {
                x: this.x + (-widthPart + widthOffset),
                y: this.y + (-height / 2 + topOffset),
                occupied: false
            },
            { // top right 2nd
                x: this.x + (widthPart -widthOffset),
                y: this.y + (- height / 2 + topOffset),
                occupied: false
            },
            { // top right 2nd
                x: this.x + (widthPart * 2 - widthOffset),
                y: this.y + (-height / 2 + topOffset),
                occupied: false
            },
            // bottom
            { // top left 1st
                x: this.x + ((-widthPart * 2) + widthOffset),
                y: this.y + (height / 2 - bottomOffset),
                occupied: false
            },
            { // top left 2nd
                x: this.x + (- widthPart + widthOffset),
                y: this.y + (height / 2 - bottomOffset),
                occupied: false
            },
            { // top right 2nd
                x: this.x + (widthPart -widthOffset),
                y: this.y + (height / 2 - bottomOffset),
                occupied: false
            },
            { // top right 2nd
                x: this.x + (widthPart * 2 - widthOffset),
                y: this.y + (height / 2 - bottomOffset),
                occupied: false
            },
            // left
            {
                x: this.x + ((-widthPart * 2 + widthOffset) - 7),
                y: this.y,
                occupied: false
            },
            // right
            {
                x: this.x + ((widthPart * 2 + widthOffset) - 5),
                y: this.y,
                occupied: false
            }
        ] as FeederSlot[];

        // for (let slot of this.slots) {
        //     this.scene.add.circle(slot.x, slot.y, 1, 0xFF0000);
        // }
    }

    tryDestroy (): void {
        this.destroy();
    }
}

export enum FeederType {
    FOOD = 'food',
    DRINK = 'drink'
}

export interface FeederSlot {
    x: number,
    y: number,
    occupied: boolean
}
