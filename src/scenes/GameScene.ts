import GameConfig from 'config/GameConfig';
import Chicken from 'core/chicken/Chicken';
import EffectManager from 'effects/EffectManager';
import { Depths } from 'enums/Depths';
import Phaser from 'phaser';
import UI from 'ui/UI';

declare let window: any;
declare let __DEV__: any;

export default class GameScene extends Phaser.Scene {

    public effectManager!: EffectManager;
    public ui!: UI;
    private testEntity!: Phaser.GameObjects.Image;
    private controls!: Phaser.Cameras.Controls.SmoothedKeyControl;
    private chickens!: Phaser.GameObjects.Group;

    constructor () {
        super({ key: 'GameScene' });
    }

    create (): void {
        window.scene = this;
        this.cameras.main.setZoom(2);
        this.cameras.main.setBackgroundColor('#00');
        this.cameras.main.centerOn(GameConfig.PhaserBasicSettings.gameSize.width / 4, GameConfig.PhaserBasicSettings.gameSize.height / 4);

        this.effectManager = new EffectManager(this);

        // this.testEntity = this.add.image(100, 100, 'test');
        this.add.image(0, 0, 'background')
            .setOrigin(0, 0)
            .setDepth(Depths.BG_TEXTURE);



        this.chickens = this.add.group();
        let chicken = new Chicken(this, 300, 100);
        this.chickens.add(chicken);


        this.time.addEvent({
            repeat: Infinity,
            delay: 1000,
            callbackScope: this,
            callback: () => {
                // @ts-ignore
                this.chickens.getChildren().forEach((chicken: Chicken) => {
                    chicken.cycle();
                });
            }
        });

        this.time.addEvent({
            repeat: Infinity,
            delay: 10000,
            callbackScope: this,
            callback: () => {
                // @ts-ignore
                this.chickens.getChildren().forEach((chicken: Chicken) => {
                    chicken.every10Seconds();
                });
            }
        });



        // this.startCameraControls();

        // this.ui = new UI(this);
    }

    update (time, delta): void {
        if (this.controls) {
            this.controls.update(delta);
        }
    }

    private startCameraControls (): void {
        const cursors = this.input.keyboard.createCursorKeys();

        const controlConfig = {
            camera: this.cameras.main,
            left: cursors.left,
            right: cursors.right,
            up: cursors.up,
            down: cursors.down,
            zoomIn: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
            zoomOut: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
            acceleration: 0.06,
            drag: 0.0005,
            maxSpeed: 1.0
        };

        this.controls = new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);
    }
}
