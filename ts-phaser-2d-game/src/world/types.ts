export type AdventureMap = {
    uid: string;
    tiles: Tile[];
    encounters: Encounter[];
    encounterRate: number;
    groupSizeRate: number[];
};

export enum Direction {
    Up = 'Up',
    Down = 'Down',
    Left = 'Left',
    Right = 'Right',
}

export type Tile = {
    position: Point;
    type: TileType;
    passageData?: { mapUid: string };
    questData?: { questUid: string };
    bossData?: { bossUid: string };
};

export enum TileType {
    Route = 'Route',
    Wall = 'Wall',
    Passage = 'Passage',
    Quest = 'Quest',
    Boss = 'Boss',
}

export type Point = { x: number; y: number };

export type MapLocation = {
    mapUid: string;
    position: Point;
};

export type Encounter = {
    enemyUid: string;
    rate: number;
};

export type DisplayTile = Tile & {
    spriteRef: Phaser.GameObjects.Rectangle | undefined;
};
