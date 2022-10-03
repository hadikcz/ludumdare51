import Egg from 'core/chicken/Egg';
import GameScene from 'scenes/GameScene';

export default class EggManager {


    public totalEggs = 0;
    public eggs: Phaser.GameObjects.Group;
    constructor (
        public scene: GameScene
    ) {
        this.eggs = this.scene.add.group();
    }

    spawnEgg (x: number, y: number, value: number): void {
        const egg = new Egg(this.scene, x, y, value);
        this.eggs.add(egg);

        this.totalEggs++;
        egg.on('born', () => {
            this.scene.chickenManager.spawnBabyChicken(x, y);
        });
    }
}
