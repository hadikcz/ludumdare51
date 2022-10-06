import { Depths } from 'enums/Depths';
import { Events } from 'enums/Events';
import GameScene from 'scenes/GameScene';

export default class WorldEnv {
    private pondWater: Phaser.GameObjects.TileSprite;

    constructor (
        private scene: GameScene
    ) {
        let bg = this.scene.add.image(0, 0, 'background')
            .setOrigin(0, 0)
            .setDepth(Depths.BG_TEXTURE);
        bg.setInteractive();
        bg.on('pointerdown', () => {
            if (this.scene.input.activePointer.downElement.localName !== 'canvas') {
                return;
            }
            this.scene.events.emit(Events.CLOSE_ALL_MODALS);
        });

        this.pondWater = this.scene.add.tileSprite(450, 200, 200, 120, 'water')
            .setOrigin(0, 0)
            .setDepth(Depths.POND_WATER);

        let pondWaterDir = 1;
        this.scene.time.addEvent({
            delay: 500,
            callbackScope: this,
            repeat: Infinity,
            callback: () => {
                this.pondWater.tilePositionX += 1 * pondWaterDir;
            }
        });

        this.scene.time.addEvent({
            delay: 5000,
            callbackScope: this,
            repeat: Infinity,
            callback: () => {
                pondWaterDir *= -1;
            }
        });
    }
}
