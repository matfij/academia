import { ENEMY_1, ENEMY_2, ENEMY_3, ENEMY_4, ENEMY_5, ENEMY_6 } from './enemies/map-1';
import { Enemy } from './types';

export const ALL_ENEMEIS: Enemy[] = [ENEMY_1, ENEMY_2, ENEMY_3, ENEMY_4, ENEMY_5, ENEMY_6];

export const getEnemy = ({ uid }: { uid: string }) => {
    const enemy = ALL_ENEMEIS.find((e) => e.uid === uid);
    if (!enemy) {
        throw new Error('Enemy not found!');
    }
    return enemy;
};
