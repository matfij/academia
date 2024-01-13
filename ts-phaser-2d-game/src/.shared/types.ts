import { BattleMove } from '../moves/types';

export type Point = {
    x: number;
    y: number;
};

export type Character = {
    uid: string;
    name: string;
    class: CharacterClass;
    baseStatistics: BaseStatistics;
    potential: CharacterPotential;
    moves: BattleMove[];
};

export type BaseStatistics = {
    health: number;
    mana: number;
    physicalDef: number;
    physicalAtk: number;
    speed: number;
    criticalChance: number;
    criticalPower: number;
};

export type CharacterPotential = {
    health: number;
    mana: number;
    physicalAtk: number;
    physicalDef: number;
    speed: number;
    criticalChance: number;
    criticalPower: number;
};

export enum CharacterClass {
    Warrior = 'Warrior',
    Hunter = 'Hunter',
    Wizzard = 'Wizzard',
}
