import GameConfig from 'config/GameConfig';
import Builder from 'core/builder/Builder';
import BuildingsManager from 'core/buildings/BuildingsManager';
import ChickenManager from 'core/chicken/ChickenManager';
import EggManager from 'core/chicken/EggManager';
import FeederManager from 'core/feeders/FeederManager';
import MatrixWorld from 'core/pathfinding/MatrixWorld';
import Shop from 'core/Shop';
import WorldEnv from 'core/WorldEnv';
import dat, { GUI } from 'dat.gui';
import EffectManager from 'effects/EffectManager';
import { Events } from 'enums/Events';
import $ from 'jquery';
import Phaser from 'phaser';
import UI from 'ui/UI';

declare let window: any;
declare let __DEV__: any;

export default class GameScene extends Phaser.Scene {

    public static readonly WORLD_COORDS = { // 36 76 600 311
        x1: 36,
        y1: 76,
        x2: 600,
        y2: 311
    };

    public effectManager!: EffectManager;
    public ui!: UI;
    private controls!: Phaser.Cameras.Controls.SmoothedKeyControl;
    public matrixWorld!: MatrixWorld;
    private debugGui!: GUI;
    private debugPathLines!: Phaser.GameObjects.Group;
    public chickenManager!: ChickenManager;
    public eggManager!: EggManager;
    public shop!: Shop;
    public feederManager!: FeederManager;
    public builder!: Builder;
    public buildingManager!: BuildingsManager;
    private worldEnv!: WorldEnv;
    private isGameOver = false;
    private gameStarted!: number;

    constructor () {
        super({ key: 'GameScene' });
    }

    create (): void {
        this.gameStarted = Date.now() / 1000;
        window.scene = this;
        this.debugPathLines = this.add.group();
        this.initDebugUI();
        this.input.setTopOnly(true);

        this.worldEnv = new WorldEnv(this);
        this.matrixWorld = new MatrixWorld(this, this.debugGui);

        this.cameras.main.setZoom(2);
        this.cameras.main.setBackgroundColor('#00');
        this.cameras.main.centerOn(GameConfig.PhaserBasicSettings.gameSize.width / 4, GameConfig.PhaserBasicSettings.gameSize.height / 4);

        this.effectManager = new EffectManager(this);


        this.shop = new Shop(this);

        this.chickenManager = new ChickenManager(this);
        this.eggManager = new EggManager(this);
        this.feederManager = new FeederManager(this, this.shop);
        this.buildingManager = new BuildingsManager(this, this.shop);

        this.builder = new Builder(this);
        // this.startCameraControls();


        this.ui = new UI(this);

        this.shop.addCoins(Shop.FEEDER_PRICE_FOOD + Shop.FEEDER_PRICE_WATER);
        setTimeout(() => {
        // this.shop.addCoins(50);
        //     this.feederManager.purchaseFeeder(250, 250, FeederType.FOOD);
        //     this.feederManager.purchaseFeeder(350, 250, FeederType.DRINK);
            this.scene.pause();
        }, 500);

        this.events.on(Events.WELCOME_CLOSED, () => {
            this.scene.resume();
        });


    }

    update (time, delta): void {
        if (this.controls) {
            this.controls.update(delta);
        }
        this.matrixWorld.update();
        this.builder.update();

        this.detectGameOver();
    }

    private initDebugUI (): void {
        this.debugGui = new dat.GUI({ autoPlace: false });
        $('#datGui').append(this.debugGui.domElement);
        // $('#datGui').hide();

        let camera = this.debugGui.addFolder('Camera');
        camera.add(this.cameras.main, 'zoom').step(1).listen();
        camera.add(this.input.activePointer, 'worldX').step(1).listen();
        camera.add(this.input.activePointer, 'worldY').step(1).listen();
        camera.open();

        this.debugGui.close();
    }

    public debugPath (points: Vector2[]): void {
        this.debugPathLines.clear(true);
        for (let i: number = 0; i < points.length; i++) {
            if (points[i + 1] === undefined) break;
            let a = points[i];
            let b = points[i + 1];
            let line = this.add.line(0, 0, a.x, a.y, b.x, b.y, 0x0000FF).setOrigin(0, 0);
            this.debugPathLines.add(line);
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

    private detectGameOver (): void {
        if (this.isGameOver) return;

        if (!this.didGameOver()) {
            return;
        }

        this.isGameOver = true;

        this.events.emit(Events.GAME_OVER, {
            timeElapsed: Date.now() / 1000 - this.gameStarted,
            totalChickens: this.chickenManager.spawnedChickens,
            totalEggs: this.eggManager.totalEggs,
            totalCoinsEarned: this.shop.coinsEarned
        } as GameOverStats);

        this.scene.pause();
    }

    private didGameOver (): boolean {
        return this.chickenManager.getChickenCount() === 0
        && this.chickenManager.getBabyChickenCount() === 0
        && this.eggManager.eggs.getChildren().length === 0;
    }
}

export interface GameOverStats {
    timeElapsed: number,
    totalChickens: number,
    totalEggs: number,
    totalCoinsEarned: number
}
