export type Point = {
    x: number;
    y: number;
};

export type Ally = {
    id: string;
    name: string;
    statistics: Statistics;
    moves: BattleMove[];
};

export type Enemy = {
    id: string;
    name: string;
    statistics: Statistics;
    moves: BattleMove[];
};

export type Statistics = {
    health: number;
    speed: number;
};

export type BattleMove = {
    id: string;
    name: string;
    damage: number;
};

export type BattleAlly = Ally & {
    alive: boolean;
    imageUrl: string;
    moveMenu: BattleAllyMoveMenu;
    selectedMove: BattleMove;
    selectedTargetId: string;
};

export type BattleAllyMoveMenu = {
    moves: BattleMove[];
};

export type BattleEnemy = Enemy & { alive: boolean; imageUrl: string };
