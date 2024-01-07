import { Boss } from '../types';
import { ENEMY_7, ENEMY_X_1 } from './enemies';

export const BOSS_1: Boss = {
    uid: 'boss-1',
    cooldownMS: 1 * 1 * 60 * 1000, // 1min
    enemies: [ENEMY_7, ENEMY_X_1, ENEMY_7],
};
