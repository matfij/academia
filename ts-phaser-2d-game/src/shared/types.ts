export type Point = {
    x: number;
    y: number;
};

export type Ally = {
    id: string;
    name: string;
    attacks: Attack[];
};

export type Enemy = {
    id: string;
    name: string;
    attacks: Attack[];
};

export type Attack = {
    name: string;
};

export type InteractiveSprite = Phaser.Types.Physics.Arcade.ImageWithDynamicBody;

export type BattleAlly = Ally & {
    sprite: InteractiveSprite;
    selectedEnemyId: string;
    attackMenu: BattleAllyAttackMenu;
};

export type BattleAllyAttackMenu = {
    container: Phaser.GameObjects.Container;
    attackA: InteractiveSprite;
    attackB: InteractiveSprite;
    attackC: InteractiveSprite;
    attackD: InteractiveSprite;
    selectedAttackIndex: number;
};

export type BattleEnemy = Enemy & { sprite: InteractiveSprite };
