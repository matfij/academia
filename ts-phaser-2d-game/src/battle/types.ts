import { BattleEnemy } from '../enemies/types';
import { Loot } from '../items/types';
import { BattleMove } from '../moves/types';
import { BattleAlly } from '../party/types';

export type BattleCharacter = {
    alive: boolean;
    battleStatistics: BattleStatistics;
}

export type BattleStatistics = {
    maxHealth: number;
    health: number;
    maxMana: number;
    mana: number;
    speed: number;
    physicalDef: number;
    physicalAtk: number;
    criticalChance: number;
    criticalPower: number;
};

export type DisplayCharacter = {
    imageUrl: string;
};

export type DisplayAlly = BattleAlly & DisplayCharacter & {
    selectedMove: BattleMove;
    selectedTargetId: string;
};

export type DisplayEnemy = BattleEnemy & DisplayCharacter;

export type BattleAction = {
    allyId: string;
    moveUid: string;
    targetId?: string;
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
    loots: Loot[];
};
