import NumberHelpers from 'helpers/NumberHelpers';
import GameScene from 'scenes/GameScene';

export default class Egg extends Phaser.GameObjects.Image {

    constructor (
        public scene: GameScene,
        x: number,
        y: number
    ) {
        super(scene, x, y, 'game', 'egg');

        this.scene.add.existing(this);

        // longer delay
        // after that born small baby chicken, which will wait 30-60 seconds before be big
        this.scene.time.addEvent({
            delay: NumberHelpers.randomIntInRange(10000, 15000),
            callbackScope: this,
            callback: () => {
                this.emit('born');

                this.destroy(true);
            }
        });
    }
}
