import 'phaser';

declare let window: any;

export default class BootScene extends Phaser.Scene {
    constructor () {
        super({ key: 'BootScene', plugins: ['Loader'] });
    }

    preload (): void {
        window.bootScene = this;
        this.sys.scale.refresh();

        const progress = this.add.graphics();
        this.load.on('progress', (value) => {
            progress.clear();
            progress.fillStyle(0xffffff, 1);
            progress.fillRect(0, this.sys.game.config.height as number / 2, this.sys.game.config.width as number * value, 60);
        });

        this.load.on('complete', () => {
            progress.destroy();
            this.startGame();
        }, this);

        // LOAD assets HERE
        this.load.setPath('assets/images');
        this.load.atlas('game', 'game.png', 'game.json');
        this.load.image('background', 'background_cut.png');

        this.load.image('chicken_orange', 'chicken_orange.png');
        this.load.image('chicken_white', 'chicken_white.png');
        this.load.image('chicken_black', 'chicken_black.png');
        this.load.image('chicken_baby', 'chicken_baby.png');
    }

    private startGame (): void {
        this.scene.start('GameScene', {});
    }
}
