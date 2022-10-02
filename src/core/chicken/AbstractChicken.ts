import { ChickenAiStates } from 'core/chicken/ChickenAiStates';
import { ChickenAnimations } from 'core/chicken/ChickenAnimations';
import Feeder, { FeederType } from 'core/feeders/Feeder';
import { Depths } from 'enums/Depths';
import ArrayHelpers from 'helpers/ArrayHelpers';
import ChanceHelpers from 'helpers/ChanceHelpers';
import NumberHelpers from 'helpers/NumberHelpers';
import TransformHelpers from 'helpers/TransformHelpers';
import GameScene from 'scenes/GameScene';
import { Vec2 } from 'types/Vec2';
import Vector2 = Phaser.Math.Vector2;
import Sprite = Phaser.GameObjects.Sprite;
import { Events } from 'enums/Events';

export default class AbstractChicken extends Phaser.GameObjects.Container {

    private static readonly AMOUNT_OF_HUNGER_PER_CYCLE = 1;
    private static readonly AMOUNT_OF_THIRST_PER_CYCLE = 1;
    private static readonly MAX_HUNGER_THIRST = 100;

    public scene!: GameScene;
    protected path: Vector2[] = [];
    protected image!: Sprite;
    public spawnedEggs = 0;
    private born: number = 0;

    private isDead: boolean = false;
    private hunger: number = 40;
    private thirst: number = 50;
    private targetFeeder: Feeder|null = null;

    protected aiState!: ChickenAiStates;
    private bubbleImage: Phaser.GameObjects.Image;
    private dieTimer: Phaser.Time.TimerEvent|null = null;
    private bubbleOffest: { x: number; y: number };
    // private shadow: Phaser.GameObjects.Arc;
    // private shadowYOffeste: number;

    constructor (scene: GameScene, x: number, y: number, private isBaby: boolean = false, protected isHomeless: boolean = false, public chickenName: string) {
        super(scene, x, y, []);

        this.scene.add.existing(this);
        this.scene.physics.world.enable(this);

        this.born = Date.now() / 1000;

        let body = this.body as Phaser.Physics.Arcade.Body;

        body.setFriction(100, 100);

        this.setDepth(Depths.CHICKEN);

        // this.setAiState(ChickenAiStates.IDLING);
        this.setAiState(ChickenAiStates.START_WANDERING);

        this.bubbleOffest = {
            x: 6,
            y: -6
        };
        this.bubbleImage = this.scene.add.image(this.x + this.bubbleOffest.x, this.y + this.bubbleOffest.y, 'game', 'ui/bubble_hunger').setOrigin(0.5, 1)
            .setDepth(Depths.BUILD_ICON);

        // this.bubbleImage.setAlpha(0);

        // this.add(this.bubbleImage);
        this.bubbleImage.setVisible(false);

        this.scene.add.tween({
            targets: this.bubbleImage,
            yoyo: true,
            repeat: Infinity,
            duration: 500,
            scale: 1.1
        });


        if (this.isHomeless) {
            this.dieTimer = this.scene.time.addEvent({
                delay: NumberHelpers.randomIntInRange(5000, 8000),
                callbackScope: this,
                callback: () => {
                    this.die();
                }
            });
        }
        //
        // this.shadowYOffeste = 4;
        // let size = 3;
        // if (this.isBaby) {
        //     size = 2;
        // }
        // this.shadow = this.scene.add.circle(this.x, this.y + this.shadowYOffeste, size, 0x000000, 0.15).setDepth(Depths.CHICKEN_SHADOW);
    }

    init (): void {
        this.image.setInteractive({ useHandCursor: true });

        this.image.on('pointerdown', () => {
            this.scene.events.emit(Events.UI_CHICKEN_OPEN, this);
        });
    }

    preUpdate (anitmationImage: Sprite|undefined): void {
        if (this.body === undefined || this.body.velocity === undefined) {
            return;
        }
        if (this.isDead) {
            return;
        }
        let pointer = this.scene.input.activePointer;
        let distance = TransformHelpers.getDistanceBetween(pointer.worldX, pointer.worldY, this.x, this.y);

        // this.shadow.setPosition(this.x, this.y + this.shadowYOffeste);
        if (this.image) {
            if (distance < 10) {
                this.image.setTint(0xFFFF00);
            } else {
                this.image.setTint(0xFFFFFF);
            }
        }

        if (this.bubbleImage.visible) {
            this.bubbleImage.setPosition(
                this.x + this.bubbleOffest.x,
                this.y + this.bubbleOffest.y,
            );
        }

        if (this.hunger <= 0 || this.thirst <= 0) {
            this.die();
        }

        if (this.isHomeless) {
            this.bubbleImage.setVisible(true);
            this.bubbleImage.setFrame('ui/bubble_no_house_smaller');
        } else if (this.isHungry(true) && this.isThirsty(true)) {
            this.bubbleImage.setVisible(true);
            this.bubbleImage.setFrame('ui/bubble_thirst_and_hunger_smaller');
        } else if (this.isHungry(true)) {
            this.bubbleImage.setVisible(true);
            this.bubbleImage.setFrame('ui/bubble_hunger_smaller');
        } else if (this.isThirsty(true)) {
            this.bubbleImage.setVisible(true);
            this.bubbleImage.setFrame('ui/bubble_thirst_smaller');
        } else {
            this.bubbleImage.setVisible(false);
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

    isChickenHomeless (): boolean {
        return this.isHomeless;
    }

    disableHomeless (): void {
        if (this.dieTimer) {
            this.dieTimer.destroy();
        }
        this.isHomeless = false;
        console.log('chicken is no longer homless');
    }

    private async processAi (): Promise<void> {
        if (this.scene === undefined) return;
        if (this.isDead) return;

        let body = this.body as Phaser.Physics.Arcade.Body;



        if (
            this.aiState === ChickenAiStates.WANDERING
            || this.aiState === ChickenAiStates.GOING_TO_EAT
            || this.aiState === ChickenAiStates.GOING_TO_DRINK
        ) {
            this.move();
        }

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

        if (this.aiState === ChickenAiStates.GO_TO_EAT) {
            let nearestFeedInfo = this.scene.feederManager.getNearestFeederSlot(this.x, this.y, FeederType.FOOD);

            if (nearestFeedInfo) {
                let path = await this.findPath(nearestFeedInfo.slot.x, nearestFeedInfo.slot.y);
                if (path) {
                    this.setPath(path);
                    this.setAiState(ChickenAiStates.GOING_TO_EAT);
                } else {
                    this.stateAiEnds();
                }
            } else {
                this.stateAiEnds();
            }

        }

        if (this.aiState === ChickenAiStates.GO_TO_DRINK) {
            let nearestFeedInfo = this.scene.feederManager.getNearestFeederSlot(this.x, this.y, FeederType.DRINK);

            if (nearestFeedInfo) {
                let path = await this.findPath(nearestFeedInfo.slot.x, nearestFeedInfo.slot.y);
                if (path) {
                    this.targetFeeder = nearestFeedInfo.feeder;
                    this.setPath(path);
                    this.setAiState(ChickenAiStates.GOING_TO_DRINK);
                } else {
                    this.stateAiEnds();
                }
            } else {
                this.stateAiEnds();
            }
        }

        const eatDrinkTime = 5000; // @TODO: DO RANDOM
        if (this.aiState === ChickenAiStates.START_EATING || this.aiState === ChickenAiStates.START_DRINKING) {
            let result = this.targetFeeder?.tryEat();
            if (result) {
                if (this.aiState === ChickenAiStates.START_EATING) {
                    this.hunger = AbstractChicken.MAX_HUNGER_THIRST;
                    this.setAiState(ChickenAiStates.EATING);
                } else {
                    this.thirst = AbstractChicken.MAX_HUNGER_THIRST;
                    this.setAiState(ChickenAiStates.DRINKING);
                }
                this.image.play(ChickenAnimations.EAT);

                this.targetFeeder = null;

                this.scene.time.delayedCall(eatDrinkTime, () => {
                    this.stateAiEnds();
                });
            } else {
                this.stateAiEnds();
            }
        }
    }

    private stateAiEnds (): void {
        if (this.scene === undefined) return;
        if (this.isDead) return;

        if (
            this.aiState === ChickenAiStates.GOING_TO_EAT
            || this.aiState === ChickenAiStates.GOING_TO_DRINK
        ) {
            if (this.aiState === ChickenAiStates.GOING_TO_EAT) {
                this.setAiState(ChickenAiStates.START_EATING);
            } else if (this.aiState === ChickenAiStates.GOING_TO_DRINK) {
                this.setAiState(ChickenAiStates.START_DRINKING);
            }

            return;
        }

        let ignoreStates: ChickenAiStates[] = [
            ChickenAiStates.GO_TO_EAT,
            ChickenAiStates.GOING_TO_EAT,
            ChickenAiStates.START_EATING,
            ChickenAiStates.EATING,
            ChickenAiStates.GO_TO_DRINK,
            ChickenAiStates.GOING_TO_DRINK,
            ChickenAiStates.START_DRINKING,
            ChickenAiStates.DRINKING
        ];

        if (!ArrayHelpers.inArray(ignoreStates, this.aiState)) {
            if (this.isHungry()) {
                let isFeedingSlotAvaialable = this.scene.feederManager.getNearestFeederSlot(this.x, this.y, FeederType.FOOD);
                if (isFeedingSlotAvaialable) {
                    this.targetFeeder = isFeedingSlotAvaialable.feeder;
                    this.setAiState(ChickenAiStates.GO_TO_EAT);
                    return;
                } else {
                    console.log('No feeder to eat found');
                }
            }

            if (this.isThirsty()) {
                let isFeedingSlotAvaialable = this.scene.feederManager.getNearestFeederSlot(this.x, this.y, FeederType.DRINK);
                if (isFeedingSlotAvaialable) {
                    this.targetFeeder = isFeedingSlotAvaialable.feeder;
                    this.setAiState(ChickenAiStates.GO_TO_DRINK);
                    return;
                } else {
                    console.log('No feeder to drink found');
                }
            }
        }

        if (this.aiState === ChickenAiStates.WANDERING) {
            if (ChanceHelpers.percentage(50) && !this.isBaby) {
                this.setAiState(ChickenAiStates.START_IDLING_LOOKING);
            } else {
                this.setAiState(ChickenAiStates.START_IDLING);
            }

        } else if (this.aiState === ChickenAiStates.IDLING || this.aiState === ChickenAiStates.IDLING_LOOKING) {
            this.setAiState(ChickenAiStates.START_WANDERING);
        }

        if (this.aiState === ChickenAiStates.EATING || this.aiState === ChickenAiStates.DRINKING) {
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

            // console.log('reach target');
            this.stateAiEnds();
            // this.reachTarget();
        }
    }

    private async findWanderingTarget (): Promise<void> {
        let newWanderPoint = await this.getRandomWanderPoint();
        if (newWanderPoint) {
            let path = await this.findPath(newWanderPoint.x, newWanderPoint.y);
            if (path) {
                this.setPath(path);
                if (this.scene.matrixWorld.isDebug()) {
                    this.scene.debugPath(path);
                }
            } else {
                console.error('Not path found');
            }
        }
    }

    private async findPath (x: number, y: number): Promise<Vector2[]|null> {
        let result = await this.scene.matrixWorld.findPathAsync(this.x, this.y, x, y);
        if (result.success) {
            result.path.splice(0, 1); // first point is me, skip it
            return result.path;
        }
        return null;
    }

    cycle (): void {
        this.processHungerAndThirst();
    }

    protected setAiState (aiState: ChickenAiStates): void {
        // console.log('changed state ' + aiState);
        this.aiState = aiState;
    }

    private processHungerAndThirst (): void {
        this.hunger -= AbstractChicken.AMOUNT_OF_HUNGER_PER_CYCLE;
        this.thirst -= AbstractChicken.AMOUNT_OF_THIRST_PER_CYCLE;
    }

    private die (): void {
        this.isDead = true;
        this.scene.effectManager.launchDeathSkull(this.x, this.y - 10);

        let body = this.body as Phaser.Physics.Arcade.Body;
        body.setVelocity(0, 0);

        this.image.stop();

        this.scene.tweens.add({
            targets: this,
            duration: 1000,
            alpha: 0,
            onComplete: () => {
                this.destroy(true);
            }
        });
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
                return randomPoint;
            }
        }

        return null;
    }

    protected isHungry (deadly = false): boolean {
        if (deadly) {
            return this.hunger <= 18;
        }
        return this.hunger <= 35;
    }

    protected isThirsty (deadly = false): boolean {
        if (deadly) {
            return this.thirst <= 18;
        }
        return this.thirst <= 35;
    }

    private setPath (path: Vector2[]): void {
        if (this.path.length > 0) {
            console.error('Chaning path before it reach end of previous path');
        }

        this.path = path;
    }

    destroy (fromScene?: boolean) {
        this.bubbleImage.destroy(fromScene);
        // this.shadow.destroy(fromScene);
        super.destroy(fromScene);
    }

    getFood (): number {
        return this.hunger;
    }

    getWater (): number {
        return this.thirst;
    }

    getAge (): string {
        let now = Date.now() / 1000;
        let diffSecs = now - this.born;
        let diffMinutes = diffSecs / 60;

        return diffMinutes.toFixed(2);
    }

    isABaby (): boolean {
        return this.isBaby;
    }
}
