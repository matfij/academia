export enum TileType {
    Wall = 'Wall',
    Route = 'Route',
    Passage = 'Passage',
    Quest = 'Quest',
    Boss = 'Boss',
}

export type Tile = {
    position: { x: number; y: number };
    type: TileType;
    passageData?: { mapUid: string };
    questData?: { questUid: string };
    bossData?: { bossUid: string };
};
