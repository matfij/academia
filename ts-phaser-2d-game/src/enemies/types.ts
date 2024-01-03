import { BattleMove } from '../moves/types';
import { BaseStatistics } from '../shared/types';

export type Enemy = {
    uid: string;
    name: string;
    baseStatistics: BaseStatistics;
    moves: BattleMove[];
};

export type BattleEnemy = Enemy & {
    id: string;
};
