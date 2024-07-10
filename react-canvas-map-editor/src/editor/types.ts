export enum SceneTileType {
    Route = 'Route',
    SafeRoute = 'SafeRoute',
    Collision = 'Collision',
    Encounter = 'Encounter',
    Passage = 'Passage',
    Quest = 'Quest',
    Npc = 'Npc',
    Empty = 'Empty',
}

export type SceneTileBase<T extends SceneTileType> = {
    position: ScenePoint;
    type: T;
};

export type SceneTile =
    | SceneTileRoute
    | SceneTileSafeRoute
    | SceneTileCollision
    | SceneTileEncounter
    | SceneTilePassage
    | SceneTileQuest
    | SceneTileNpc;

export type SceneTileRoute = SceneTileBase<SceneTileType.Route>;
export type SceneTileSafeRoute = SceneTileBase<SceneTileType.SafeRoute>;
export type SceneTileCollision = SceneTileBase<SceneTileType.Collision>;
export type SceneTileEncounter = SceneTileBase<SceneTileType.Encounter> & {
    encounterData: {
        encounterName: string;
    };
};
export type SceneTilePassage = SceneTileBase<SceneTileType.Passage> & {
    passageData?: {
        SceneName: string;
        position: ScenePoint;
        locked: () => boolean;
    };
};
export type SceneTileQuest = SceneTileBase<SceneTileType.Quest> & {
    questData?: {
        questName: string;
    };
};
export type SceneTileNpc = SceneTileBase<SceneTileType.Npc> & {
    npcData?: {
        npcName: string;
    };
};

export type ScenePoint = {
    x: number;
    y: number;
};
