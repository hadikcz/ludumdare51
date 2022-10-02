import { IBuildingBounds } from 'core/builder/IBuildingBounds';
import ArrayHelpers from 'helpers/ArrayHelpers';
import TransformHelpers from 'helpers/TransformHelpers';
import GameScene from 'scenes/GameScene';
import { Vec2 } from 'types/Vec2';

export default class Feeder extends Phaser.GameObjects.Image implements IBuildingBounds {


    private static readonly MAX_VALUE = 50;
    private slots: FeederSlot[] = [];

    constructor (
        public scene: GameScene,
        x: number,
        y: number,
        private typeOf: FeederType,
        private amount: number = 15
    ) {
        super(scene, x, y, 'game', 'feeder_water_1');

        this.scene.add.existing(this);

        this.setInteractive({ useHandCursor: true });
        this.detectAndSetImage();
        this.generateFeedingSlots();
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

    purchaseFill (): void {
        if (!this.canPurchaseFill()) {
            return;
        }
        this.amount += 5;

        this.detectAndSetImage();
    }

    canPurchaseFill (): boolean {
        return this.amount < Feeder.MAX_VALUE;
    }

    tryEat (): boolean {
        if (this.amount >= 1) {
            this.amount--;
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

        if (this.amount <= 50 && this.amount > 37.5) {
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
