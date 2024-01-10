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
    moves: BattleMove[];
};

export type BaseStatistics = {
    health: number;
    speed: number;
};


export enum CharacterClass {
    Warrior = 'Warrior',
    Hunter = 'Hunter',
    Wizzard = 'Wizzard',
}
