import { Enemy } from '../enemies/types';

export type DisplayCharacter = {
    alive: boolean;
    imageUrl: string;
};

export type DisplayEnemy = Enemy & DisplayCharacter;

export type BattleStatistics = {
    maxHealth: number;
    health: number;
    speed: number;
};

export type TurnStatus = {
    userId: string;
    targetId: string;
    moveUsed: string;
    damageReceived: number;
};

export type BattleResult = {
    victory: boolean;
    experience: number;
    gold: number;
};
