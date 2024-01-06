import { ENEMY_2, ENEMY_4, ENEMY_5, ENEMY_6 } from '../../enemies/enemies/map-1';
import { AdventureMap } from '../types';
import { MAP_2_TILES } from './map-2-tiles';

export const MAP_2: AdventureMap = {
    uid: 'map-2',
    tiles: MAP_2_TILES,
    encounterRate: 0.05,
    groupSizeRate: [1, 0.9, 0.5, 0.33, 0.22, 0.1, 0.1, 0.1, 0.1],
    encounters: [
        {
            enemyUid: ENEMY_2.uid,
            rate: 0.5,
        },
        {
            enemyUid: ENEMY_5.uid,
            rate: 0.7,
        },
        {
            enemyUid: ENEMY_6.uid,
            rate: 0.2,
        },
        {
            enemyUid: ENEMY_4.uid,
            rate: 0.1,
        },
    ],
};
