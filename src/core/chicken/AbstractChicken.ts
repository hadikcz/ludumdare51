import { ChickenAiStates } from 'core/chicken/ChickenAiStates';
import { ChickenAnimations } from 'core/chicken/ChickenAnimations';
import { Depths } from 'enums/Depths';
import ChanceHelpers from 'helpers/ChanceHelpers';
import NumberHelpers from 'helpers/NumberHelpers';
import TransformHelpers from 'helpers/TransformHelpers';
import GameScene from 'scenes/GameScene';
import { Vec2 } from 'types/Vec2';
import Vector2 = Phaser.Math.Vector2;
import Sprite = Phaser.GameObjects.Sprite;

export default class AbstractChicken extends Phaser.GameObjects.Container {

    private static readonly AMOUNT_OF_HUNGER_PER_CYCLE = 1;
    private static readonly AMOUNT_OF_THIRST_PER_CYCLE = 1;

    public scene!: GameScene;
    protected path: Vector2[] = [];
    protected image!: Sprite;

    private isDead: boolean = false;
    private hunger: number = 50;
    private thirst: number = 50;

    protected aiState!: ChickenAiStates;

    constructor (scene: GameScene, x: number, y: number, private isBaby: boolean = false) {
        super(scene, x, y, []);


        this.scene.add.existing(this);
        this.scene.physics.world.enable(this);

        let body = this.body as Phaser.Physics.Arcade.Body;

        body.setFriction(100, 100);

        this.setDepth(Depths.CHICKEN);

        // this.setAiState(ChickenAiStates.IDLING);
        this.setAiState(ChickenAiStates.START_WANDERING);
    }

    preUpdate (anitmationImage: Sprite|undefined): void {
        if (this.body === undefined || this.body.velocity === undefined) {
            return;
        }
        if (this.isDead) {
            return;
        }

        if (this.hunger <= 0 || this.thirst <= 0) {
            this.die();
        }


        if (anitmationImage) {
            if (this.body === undefined) {
                return;
            }

            if (this.body.velocity.x < 0) {
                anitmationImage.setScale(-1, 1);
            } else if (this.body.velocity.x > 0) {
                anitmationImage.setScale(1, 1);
            }
        }

        this.processAi();
    }

    private async processAi (): Promise<void> {
        console.log(this.aiState);

        let body = this.body as Phaser.Physics.Arcade.Body;
        if (this.aiState === ChickenAiStates.START_IDLING) {
            body.setVelocity(0, 0);

            this.image.play(ChickenAnimations.IDLING, true);

            this.setAiState(ChickenAiStates.IDLING);

            this.scene.time.delayedCall(
                NumberHelpers.randomIntInRange(5000, 15000),
                () => {this.stateAiEnds();},
            );
        }
        if (this.aiState === ChickenAiStates.START_IDLING_LOOKING) {
            body.setVelocity(0, 0);

            this.image.play(ChickenAnimations.IDLING_LOOKING, true);

            this.setAiState(ChickenAiStates.IDLING_LOOKING);

            this.scene.time.delayedCall(
                NumberHelpers.randomIntInRange(5000, 15000),
                () => {this.stateAiEnds();},
            );
        }

        if (this.aiState === ChickenAiStates.START_WANDERING) {
            await this.findWanderingTarget();
            this.image.play(ChickenAnimations.WALK, true);
            this.setAiState(ChickenAiStates.WANDERING);
        }

        if (this.aiState === ChickenAiStates.WANDERING) {
            this.move();
        }
    }

    private stateAiEnds (): void {
        if (this.aiState === ChickenAiStates.WANDERING) {
            if (ChanceHelpers.percentage(50) && !this.isBaby) {
                this.setAiState(ChickenAiStates.START_IDLING_LOOKING);
            } else {
                this.setAiState(ChickenAiStates.START_IDLING);
            }

        } else if (this.aiState === ChickenAiStates.IDLING || this.aiState === ChickenAiStates.IDLING_LOOKING) {
            this.setAiState(ChickenAiStates.START_WANDERING);
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

            this.stateAiEnds();
            // this.reachTarget();
        }
    }

    private async findWanderingTarget (): Promise<void> {
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
    }

    cycle (): void {
        this.processHungerAndThirst();
    }

    protected setAiState (aiState: ChickenAiStates): void {
        console.log('changed state ' + aiState);
        this.aiState = aiState;
    }

    private processHungerAndThirst (): void {
        this.hunger -= AbstractChicken.AMOUNT_OF_HUNGER_PER_CYCLE;
        this.thirst -= AbstractChicken.AMOUNT_OF_THIRST_PER_CYCLE;
    }

    private die (): void {
        console.log('die');
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
