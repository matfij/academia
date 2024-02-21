export enum MapTileType {
    Route = 'Route',
    SafeRoute = 'SafeRoute',
    Collision = 'Collision',
    Encounter = 'Encounter',
    Passage = 'Passage',
    Quest = 'Quest',
    Npc = 'Npc',
}

export type MapTileBase<T extends MapTileType> = {
    position: MapPoint;
    type: T;
};

export type MapTile =
    | MapTileRoute
    | MapTileSafeRoute
    | MapTileCollision
    | MapTileEncunter
    | MapTilePassage
    | MapTileQuest
    | MapTileNpc;

export type MapTileRoute = MapTileBase<MapTileType.Route>;
export type MapTileSafeRoute = MapTileBase<MapTileType.SafeRoute>;
export type MapTileCollision = MapTileBase<MapTileType.Collision>;
export type MapTileEncunter = MapTileBase<MapTileType.Encounter> & {
    encounterData: {
        encounterName: string;
    };
};
export type MapTilePassage = MapTileBase<MapTileType.Passage> & {
    passageData?: {
        mapName: string;
        position: MapPoint;
        locked: () => boolean;
    };
};
export type MapTileQuest = MapTileBase<MapTileType.Quest> & {
    questData?: {
        questName: string;
    };
};
export type MapTileNpc = MapTileBase<MapTileType.Npc> & {
    npcData?: {
        npcName: string;
    };
};

export type MapPoint = {
    x: number;
    y: number;
};
