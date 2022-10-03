import ChickenHouse from 'core/buildings/ChickenHouse';
import Well from 'core/buildings/Well';
import Shop from 'core/Shop';
import { Events } from 'enums/Events';
import ArrayHelpers from 'helpers/ArrayHelpers';
import GameScene from 'scenes/GameScene';

export default class BuildingsManager {
    public readonly chickenHouses: Phaser.GameObjects.Group;
    private wells: Phaser.GameObjects.Group;

    constructor (
        private scene: GameScene,
        private shop: Shop
    ) {
        this.chickenHouses = this.scene.add.group();
        this.wells = this.scene.add.group();
    }

    purchaseChickenHouse (x: number, y: number): void {
        if (!this.shop.canPurchaseChickenHouse()) {
            console.info('Can not purchase chicken house, because coins');
            return;
        }

        this.shop.purchaseChickenHouse();
        let chickenHouse = new ChickenHouse(this.scene, x, y);
        this.chickenHouses.add(chickenHouse);


        this.scene.chickenManager.housePurchasedIncreaseLimit();
    }

    purchaseWell (x: number, y: number): void {
        if (!this.shop.canPurhcaseWell()) {
            console.info('Can not purchase well, because coins');
            return;
        }
        this.shop.purchaseWell();

        let well = new Well(this.scene, x, y);
        this.wells.add(well);

        this.scene.events.emit(Events.NEW_WELL_PURCHASED);
    }


    getFullestWell (): Well|null {
        // @ts-ignore
        let well = ArrayHelpers.findHighest<Well>(this.wells.getChildren(), (well: Well) => {
            return well.getWellAmount();
        }) as unknown as Well|null;

        if (well && well.canBeTakenFrom()) {
            return well;
        }

        return null;
    }
}
