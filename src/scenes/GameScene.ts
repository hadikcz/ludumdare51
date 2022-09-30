import EffectManager from 'effects/EffectManager';
import Phaser from 'phaser';
import UI from 'ui/UI';

declare let window: any;
declare let __DEV__: any;

export default class GameScene extends Phaser.Scene {

    public effectManager!: EffectManager;
    public ui!: UI;
    private testEntity!: Phaser.GameObjects.Image;

    constructor () {
        super({ key: 'GameScene' });
    }

    create (): void {
        window.scene = this;
        this.cameras.main.setBackgroundColor('#00');
        this.cameras.main.setZoom(1);

        this.effectManager = new EffectManager(this);


        this.testEntity = this.add.image(100, 100, 'test');

        this.ui = new UI(this);
    }

    update (): void {
        this.testEntity.x += 1;
    }
}
