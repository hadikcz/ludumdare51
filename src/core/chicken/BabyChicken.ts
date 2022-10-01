import AbstractChicken from 'core/chicken/AbstractChicken';
import NumberHelpers from 'helpers/NumberHelpers';
import GameScene from 'scenes/GameScene';

export default class BabyChicken extends AbstractChicken {
    private image: Phaser.GameObjects.Image;

    constructor (public scene: GameScene, x: number, y: number) {
        super(scene, x, y);



        this.image = this.scene.add.image(0, 0, 'game', 'chicken_baby_static');
        this.add(this.image);

        this.scene.time.addEvent({
            delay: NumberHelpers.randomIntInRange(10000, 10000),
            callbackScope: this,
            callback: this.bornChicken
        });
    }

    private bornChicken (): void {
        this.scene.chickenManager.spawnChicken(this.x, this.y);
        this.destroy(true);
    }
}
