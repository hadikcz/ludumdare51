import { Buildings } from 'core/builder/Buildings';
import { IBuildingBounds } from 'core/builder/IBuildingBounds';
import { FeederType } from 'core/feeders/Feeder';
import { Depths } from 'enums/Depths';
import { Events } from 'enums/Events';
import { Subject } from 'rxjs';
import GameScene from 'scenes/GameScene';

export default class Builder {

    private buildMode: Buildings|null = null;
    public buildModeRunning$: Subject<boolean>;
    private previewImage: Phaser.GameObjects.Image;
    private canPlace: boolean = false;

    constructor (
        public scene: GameScene
    ) {
        this.buildModeRunning$ = new Subject<boolean>();
        this.buildModeRunning$.next(this.isBuildMode());

        this.previewImage = this.scene.add.image(-1000, -1000, 'game', 'egg')
            .setDepth(Depths.BUILD_ICON).setVisible(false);

        this.scene.input.on('pointerdown', (pointer, obj) => {
            if (!this.isBuildMode()) return;
            this.finishBuilding(pointer.worldX, pointer.worldY);
        });

        this.scene.events.on(Events.CANCEL_BUILDING, () => {
            this.cancelBuilding();
        });
    }

    update (): void {
        if (this.buildMode !== null) {
            this.canPlace = this.canPlaceIntersectionCheck();
            this.previewImage.setPosition(this.scene.input.activePointer.worldX, this.scene.input.activePointer.worldY).setVisible(true);

            if (this.canPlace) {
                this.previewImage.setTint(0x00FF00);
            } else {
                this.previewImage.setTint(0xFF0000);
            }
        } else {
            this.canPlace = false;
        }
    }

    isBuildMode (): boolean {
        return !!this.buildMode;
    }

    startBuild (building: Buildings): void {
        if (this.isBuildMode()) return;

        // const requiredPrice = this.getBuildingPrice(building);
        // if (this.scene.money < requiredPrice) {
        //     return;
        // }

        // this.scene.ui.showBuildMode(building.toString());
        let frame = this.getFrameFromBuilding(building);
        if (!frame) {
            throw new Error('Building image not found ' + building);
        }
        this.previewImage.setFrame(frame);
        console.log('start build');
        this.buildMode = building;
        this.buildModeRunning$.next(this.isBuildMode());
    }

    private finishBuilding (x: number, y: number): void {
        if (!this.isBuildMode()) return;
        if (!this.canPlace) return;

        if (this.buildMode === Buildings.FEEDER_FOOD) {
            this.scene.feederManager.purchaseFeeder(
                x,
                y,
                FeederType.FOOD
            );
        }


        if (this.buildMode === Buildings.FEEDER_WATER) {
            this.scene.feederManager.purchaseFeeder(
                x,
                y,
                FeederType.DRINK
            );
        }

        this.cancelBuilding();
    }

    private cancelBuilding (): void {
        this.buildMode = null;
        this.buildModeRunning$.next(this.isBuildMode());
        this.previewImage.setPosition(-100, -100).setVisible(false);
    }

    private canPlaceIntersectionCheck (): boolean {
        let bounds = this.previewImage.getBounds();

        if (!this.scene.matrixWorld.isTileAvailable(bounds.left, bounds.top)) {
            return false;
        }
        if (!this.scene.matrixWorld.isTileAvailable(bounds.right, bounds.top)) {
            return false;
        }
        if (!this.scene.matrixWorld.isTileAvailable(bounds.left, bounds.bottom)) {
            return false;
        }
        if (!this.scene.matrixWorld.isTileAvailable(bounds.right, bounds.bottom)) {
            return false;
        }

        // @ts-ignore
        for (let object: IBuildingBounds of this.scene.feederManager.feeders.getChildren()) {
            if (Phaser.Geom.Intersects.RectangleToRectangle(
                this.previewImage.getBounds(),
                // @ts-ignore
                object.getImageBounds()
            )) {
                return false;
            }
        }
        return true; // @TODO
    }

    private getFrameFromBuilding (building: Buildings): string|null {
        switch (building) {
            case Buildings.FEEDER_FOOD:
                return 'feeder_food_4';
            case Buildings.FEEDER_WATER:
                return 'feeder_water_5';
            case Buildings.CHICKEN_HOUSE:
                return 'chicken_coop';
            case Buildings.WELL:
                return 'well';
            default:
                return null;
        }
    }
}
