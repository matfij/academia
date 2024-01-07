import { Enemy } from '../types';

export const BOSS_1: Enemy = {
    uid: 'enemy-x-1',
    name: 'Deus Cras',
    baseStatistics: {
        speed: 100,
        health: 2500,
    },
    moves: [{ uid: 'move-01', name: 'Daybreak', damage: 333 }],
};
