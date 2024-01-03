import { BattleMove } from '../moves/types';

export type Point = {
    x: number;
    y: number;
};

export type Character = {
    uid: string;
    name: string;
    baseStatistics: BaseStatistics;
    moves: BattleMove[];
};

export type BaseStatistics = {
    health: number;
    speed: number;
};
