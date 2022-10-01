import Egg from 'core/chicken/Egg';
import GameScene from 'scenes/GameScene';

export default class EggManager {

    constructor (
        public scene: GameScene
    ) {

    }

    spawnEgg (x: number, y: number): void {
        const egg = new Egg(this.scene, x, y);
        egg.on('born', () => {
            this.scene.chickenManager.spawnBabyChicken(x, y);
        });
    }
}
