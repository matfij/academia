import { BOSS_1 } from './enemies/bosses';
import { ENEMY_1, ENEMY_2, ENEMY_3, ENEMY_4, ENEMY_5, ENEMY_6, ENEMY_7, ENEMY_X_1 } from './enemies/enemies';
import { Boss, Enemy } from './types';

export const ALL_ENEMEIS: Enemy[] = [
    ENEMY_1,
    ENEMY_2,
    ENEMY_3,
    ENEMY_4,
    ENEMY_5,
    ENEMY_6,
    ENEMY_7,
    ENEMY_X_1,
];

export const getEnemy = ({ uid }: { uid: string }) => {
    const enemy = ALL_ENEMEIS.find((e) => e.uid === uid);
    if (!enemy) {
        throw new Error('Enemy not found!');
    }
    return { ...enemy };
};

export const ALL_BOSSES: Boss[] = [BOSS_1];

export const getBoss = ({ uid }: { uid: string }) => {
    const boss = ALL_BOSSES.find((b) => b.uid === uid);
    if (!boss) {
        throw new Error('Boss not found!');
    }
    return { ...boss };
};
