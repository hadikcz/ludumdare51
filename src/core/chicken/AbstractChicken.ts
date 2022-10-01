import { Depths } from 'enums/Depths';
import GameScene from 'scenes/GameScene';
import Vector2Like = Phaser.Types.Math.Vector2Like;
import TransformHelpers from 'helpers/TransformHelpers';
import Vector2 = Phaser.Math.Vector2;
import { Vec2 } from 'types/Vec2';

export default class AbstractChicken extends Phaser.GameObjects.Container {

    private static readonly AMOUNT_OF_HUNGER_PER_CYCLE = 1;
    private static readonly AMOUNT_OF_THIRST_PER_CYCLE = 1;

    public scene!: GameScene;
    protected path: Vector2[] = [];

    private isDead: boolean = false;
    private hunger: number = 50;
    private thirst: number = 50;

    constructor (scene: GameScene, x: number, y: number) {
        super(scene, x, y, []);


        this.scene.add.existing(this);
        this.scene.physics.world.enable(this);

        let body = this.body as Phaser.Physics.Arcade.Body;

        body.setFriction(100, 100);

        this.setDepth(Depths.CHICKEN);


        this.start();
    }

    preUpdate (): void {
        if (this.isDead) {
            return;
        }

        if (this.hunger <= 0 || this.thirst <= 0) {
            this.die();
        }

        this.move();
    }

    private async start (): Promise<void> {
        let newWanderPoint = await this.getRandomWanderPoint();
        if (newWanderPoint) {
            this.scene.matrixWorld.findPath(this.x, this.y, 250, 250, (status, points) => {
                if (status) {
                    points.splice(0, 1);
                    this.path = points;
                }
                if (this.scene.matrixWorld.isDebug()) {
                    this.scene.debugPath(points);
                }
            }, true, this);
        }
    }

    private async move (): Promise<void> {
        let body = this.body as Phaser.Physics.Arcade.Body;

        if (this.path.length > 0) {
            let currentTarget = this.path[0];
            if (Phaser.Math.Distance.Between(currentTarget.x, currentTarget.y, this.x, this.y) <= 5) {
                this.path.shift();
            }
            this.scene.physics.moveTo(this, currentTarget.x, currentTarget.y, 25);
        } else {
            body.setVelocity(0, 0);
            let newWanderPoint = await this.getRandomWanderPoint();
            if (newWanderPoint) {
                this.scene.matrixWorld.findPath(this.x, this.y, newWanderPoint.x, newWanderPoint.y, (status, points) => {
                    if (status) {
                        points.splice(0, 1);
                        this.path = points;
                    }
                    if (this.scene.matrixWorld.isDebug()) {
                        this.scene.debugPath(points);
                    }
                }, true, this);
            }
            console.log('reach target');
            // this.reachTarget();
        }
    }

    cycle (): void {
        this.processHungerAndThirst();
    }

    private processHungerAndThirst (): void {
        this.hunger -= AbstractChicken.AMOUNT_OF_HUNGER_PER_CYCLE;
        this.thirst -= AbstractChicken.AMOUNT_OF_THIRST_PER_CYCLE;
    }

    private die (): void {
        this.destroy(true);
    }

    private async getRandomWanderPoint (): Promise<Vec2|null> {
        let attempts = 0;
        // eslint-disable-next-line no-constant-condition
        while (true) {
            if (attempts > 10) {
                attempts++;
                console.log('break after so many attemts');
                break;
            }

            let randomPoint = TransformHelpers.randomPoint(
                GameScene.WORLD_COORDS.x1,
                GameScene.WORLD_COORDS.y1,
                GameScene.WORLD_COORDS.x2,
                GameScene.WORLD_COORDS.y2,
            );

            if (await this.scene.matrixWorld.canMoveTo(this.x, this.y, randomPoint.x, randomPoint.y)) {
                console.log('wander point');
                console.log(randomPoint);
                return randomPoint;
            }
        }

        return null;
    }
}
