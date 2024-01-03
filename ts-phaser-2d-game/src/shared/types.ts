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

export type DisplayCharacter = Character & {
    alive: boolean;
    imageUrl: string;
    battleStatistics: BattleStatistics;
};

export type TurnStatus = {
    userId: string;
    targetId: string;
    moveUsed: string;
    damageReceived: number;
};

export type BattleAlly = DisplayCharacter & {
    selectedMove: BattleMove;
    selectedTargetId: string;
    battleStatistics: BattleStatistics;
};

export type BattleStatistics = {
    maxHealth: number;
    health: number;
    speed: number;
};

export type BattleResult = {
    victory: boolean;
    experience: number;
    gold: number;
};
