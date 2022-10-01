import ArrayHelpers from 'helpers/ArrayHelpers';

export enum ChickenTypes {
    WHITE = 'white',
    BLACK = 'black',
    ORANGE = 'orange',
}


export function GetRandomChickenType (): ChickenTypes {
    return ArrayHelpers.getRandomFromArrayTyped<ChickenTypes>(Object.values(ChickenTypes));
}
