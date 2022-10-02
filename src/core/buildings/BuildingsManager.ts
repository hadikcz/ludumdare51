import ChickenHouse from 'core/buildings/ChickenHouse';
import Shop from 'core/Shop';
import GameScene from 'scenes/GameScene';

export default class BuildingsManager {
    private chickenHouses: Phaser.GameObjects.Group;
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

        let chickenHouse = new ChickenHouse(this.scene, x, y);
        this.chickenHouses.add(chickenHouse);

        this.shop.purchaseChickenHouse();

        this.scene.chickenManager.housePurchasedIncreaseLimit();
    }
}
