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
}

export type BattleMove = {
    id: string;
    name: string;
    damage: number;
};

export type InteractiveSprite = Phaser.Types.Physics.Arcade.ImageWithDynamicBody;

export type BattleAlly = Ally & {
    alive: boolean;
    sprite: InteractiveSprite;
    moveMenu: BattleAllyMoveMenu;
    selectedMoveId: string;
    selectedTargetId: string;
};

export type BattleAllyMoveMenu = {
    moveA: InteractiveSprite;
    moveB: InteractiveSprite;
    moveC: InteractiveSprite;
    moveD: InteractiveSprite;
    container: Phaser.GameObjects.Container;
};

export type BattleEnemy = Enemy & { alive: boolean; sprite: InteractiveSprite };
