export type Point = {
    x: number;
    y: number;
};

export type Character = {
    id: string;
    name: string;
    baseStatistics: BaseStatistics;
    moves: BattleMove[];
};

export type BaseStatistics = {
    health: number;
    speed: number;
};

export type BattleMove = {
    id: string;
    name: string;
    damage: number;
};

export type BattleCharacter = Character & {
    alive: boolean;
    imageUrl: string;
    battleStatistics: BattleStatistics;
};

export type BattleAlly = BattleCharacter & {
    selectedMove: BattleMove;
    selectedTargetId: string;
    battleStatistics: BattleStatistics;
};

export type BattleEnemy = BattleCharacter;

export type BattleStatistics = {
    maxHealth: number;
    health: number;
    speed: number;
};
