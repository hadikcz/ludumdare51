import Image = Phaser.GameObjects.Image;
import { Depths } from 'enums/Depths';
import GameScene from 'scenes/GameScene';

export default class ChickenHouse extends Image {

    constructor (
        public scene: GameScene,
        x: number,
        y: number
    ) {
        super(scene, x, y, 'game', 'chicken_coop');

        this.scene.add.existing(this);

        this.setDepth(Depths.CHICKEN_HOUSE);
    }
}
