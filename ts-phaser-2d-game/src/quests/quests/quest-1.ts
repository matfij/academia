import { ENEMY_1, ENEMY_2 } from '../../enemies/enemies/map-1';
import { MAP_1 } from '../../world/maps/map-1';
import { Quest } from '../types';

export const QUEST_1: Quest = {
    uid: 'quest-001',
    name: 'Goblin Killer I',
    questsRequired: [],
    startLocation: {
        mapUid: MAP_1.uid,
        position: { x: 770, y: 490 },
    },
    steps: [
        {
            message: 'Welcome traveller, get rid of these filthy goblins for me!',
            location: {
                mapUid: MAP_1.uid,
                position: { x: 770, y: 490 },
            },
            killsRequired: [
                {
                    enemyUid: ENEMY_1.uid,
                    amount: 3,
                },
            ],
            itemsRequired: [],
        },
        {
            message: 'Peg your pardon, there are some more!',
            location: {
                mapUid: MAP_1.uid,
                position: { x: 770, y: 490 },
            },
            killsRequired: [
                {
                    enemyUid: ENEMY_1.uid,
                    amount: 2,
                },
                {
                    enemyUid: ENEMY_2.uid,
                    amount: 1,
                },
            ],
            itemsRequired: [],
        },
        {
            message: 'Thanks for helping me back then, good luck on your jurney!',
            location: {
                mapUid: MAP_1.uid,
                position: { x: 770, y: 490 },
            },
            killsRequired: [],
            itemsRequired: [],
        },
    ],
};
