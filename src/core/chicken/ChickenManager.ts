import AbstractChicken from 'core/chicken/AbstractChicken';
import BabyChicken from 'core/chicken/BabyChicken';
import Chicken from 'core/chicken/Chicken';
import ArrayHelpers from 'helpers/ArrayHelpers';
import Phaser from 'phaser';
import { Subject } from 'rxjs';
import GameScene from 'scenes/GameScene';

export default class ChickenManager {

    public static readonly CHICKEN_PER_HOUSE = 25;
    private chickens: Phaser.GameObjects.Group;
    private babyChickens: Phaser.GameObjects.Group;
    public readonly chickensCount$: Subject<number>;
    public readonly babyChickensCount$: Subject<number>;
    public readonly maxChickenLimit$: Subject<number>;
    public maxChickenLimit: number = 10;

    constructor (
        private scene: GameScene
    ) {
        this.chickens = this.scene.add.group();
        this.babyChickens = this.scene.add.group();

        this.chickensCount$ = new Subject<number>();
        this.babyChickensCount$ = new Subject<number>();
        this.maxChickenLimit$ = new Subject<number>();

        this.startTimers();

        this.spawnChicken(300, 300);
    }

    spawnChicken (x: number, y: number, name: string|null = null): void {
        if (!name) {
            name = this.getRandomName();
        }
        let isHomeless = this.chickens.getChildren().length >= this.maxChickenLimit;
        const chicken = new Chicken(this.scene, x, y, isHomeless, name);
        chicken.on('destroy', () => {
            this.chickensCount$.next(this.getChickenCount());
        });
        this.chickens.add(chicken);

        this.chickensCount$.next(this.getChickenCount());
    }

    spawnBabyChicken (x: number, y: number): void {
        let name = this.getRandomName();
        const babyChicken = new BabyChicken(this.scene, x, y, false, name);
        babyChicken.on('destroy', () => {
            this.babyChickensCount$.next(this.getBabyChickenCount());
        });
        this.babyChickens.add(babyChicken);
        this.babyChickensCount$.next(this.getBabyChickenCount());
    }

    getChickenCount (): number {
        return this.chickens.getChildren().length;
    }

    getMaxChickenLimit (): number {
        return this.maxChickenLimit;
    }

    getBabyChickenCount (): number {
        return this.babyChickens.getChildren().length;
    }

    housePurchasedIncreaseLimit (): void {
        this.maxChickenLimit += ChickenManager.CHICKEN_PER_HOUSE;
        this.maxChickenLimit$.next(this.maxChickenLimit);

        this.checkHomlessChicken();
    }

    private checkHomlessChicken (): void {
        let notHomelessChickenCount = 0;
        // @ts-ignore
        for (let chicken: AbstractChicken of this.chickens.getChildren()) {
            // @ts-ignore
            if (!chicken.isChickenHomeless()) {
                notHomelessChickenCount++;
            }
        }

        console.log('found not homeless chicken ' + notHomelessChickenCount);

        let countOfChickenWhichCanLiveInHouseNow = this.getMaxChickenLimit() - notHomelessChickenCount;

        console.log('countOfChickenWhichCanLiveInHouseNow ' + countOfChickenWhichCanLiveInHouseNow);

        // @ts-ignore
        for (let chicken: AbstractChicken of this.chickens.getChildren()) {
            // @ts-ignore
            if (chicken.isChickenHomeless() && countOfChickenWhichCanLiveInHouseNow > 0) {
                // @ts-ignore
                chicken.disableHomeless();
                countOfChickenWhichCanLiveInHouseNow--;
            }
        }
    }

    private startTimers (): void {
        this.scene.time.addEvent({
            repeat: Infinity,
            delay: 1000,
            callbackScope: this,
            callback: () => {
                // @ts-ignore
                this.chickens.getChildren().forEach((chicken: Chicken) => {
                    chicken.cycle();
                });
                // @ts-ignore
                this.babyChickens.getChildren().forEach((chicken: BabyChicken) => {
                    chicken.cycle();
                });
            }
        });

        this.scene.time.addEvent({
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

    }

    private getRandomName (): string {
        let names = [
            'Mary',
            'Patricia',
            'Jennifer',
            'Linda',
            'Elizabeth',
            'Barbara',
            'Susan',
            'Jessica',
            'Sarah',
            'Karen',
            'Lisa',
            'Nancy',
            'Betty',
            'Margaret',
            'Sandra',
            'Ashley',
            'Kimberly',
            'Emily',
            'Donna',
            'Michelle',
            'Carol',
            'Amanda',
            'Dorothy',
            'Melissa',
            'Deborah',
            'Stephanie',
            'Rebecca',
            'Sharon',
            'Laura',
            'Cynthia',
            'Kathleen',
            'Amy',
            'Angela',
            'Shirley',
            'Anna',
            'Brenda',
            'Pamela',
            'Emma',
            'Nicole',
            'Helen',
            'Samantha',
            'Katherine',
            'Christine',
            'Debra',
            'Rachel',
            'Carolyn',
            'Janet',
            'Catherine',
            'Maria',
            'Heather',
            'Diane',
            'Ruth',
            'Julie',
            'Olivia',
            'Joyce',
            'Virginia',
            'Victoria',
            'Kelly',
            'Lauren',
            'Christina',
            'Joan',
            'Evelyn',
            'Judith',
            'Megan',
            'Andrea',
            'Cheryl',
            'Hannah',
            'Jacqueline',
            'Martha',
            'Gloria',
            'Teresa',
            'Ann',
            'Sara',
            'Madison',
            'Frances',
            'Kathryn',
            'Janice',
            'Jean',
            'Abigail',
            'Alice',
            'Julia',
            'Judy',
            'Sophia',
            'Grace',
            'Denise',
            'Amber',
            'Doris',
            'Marilyn',
            'Danielle',
            'Beverly',
            'Isabella',
            'Theresa',
            'Diana',
            'Natalie',
            'Brittany',
            'Charlotte',
            'Marie',
            'Kayla',
            'Alexis',
            'Lori',
        ];

        return ArrayHelpers.getRandomFromArray(names);
    }
}
