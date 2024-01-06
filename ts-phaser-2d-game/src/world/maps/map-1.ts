import { ENEMY_1, ENEMY_2, ENEMY_3, ENEMY_4 } from '../../enemies/enemies/map-1';
import { AdventureMap } from '../types';
import { MAP_1_TILES } from './map-1-tiles';

export const MAP_1: AdventureMap = {
    uid: 'map-1',
    tiles: MAP_1_TILES,
    encounterRate: 0.03,
    groupSizeRate: [1, 0.9, 0.5, 0.33, 0.22, 0.1, 0.1, 0.1, 0.1],
    encounters: [
        {
            enemyUid: ENEMY_1.uid,
            rate: 0.7,
        },
        {
            enemyUid: ENEMY_2.uid,
            rate: 0.5,
        },
        {
            enemyUid: ENEMY_3.uid,
            rate: 0.3,
        },
        {
            enemyUid: ENEMY_4.uid,
            rate: 0.01,
        },
    ],
};
