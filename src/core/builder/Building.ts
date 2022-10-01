import Container = Phaser.GameObjects.Container;
import GameScene from 'scenes/GameScene';

export default class Building extends Container {

    constructor (
        public scene: GameScene,
        x: number,
        y: number
    ) {
        super(scene, x, y, []);

        this.scene.add.existing(this);
    }

}
