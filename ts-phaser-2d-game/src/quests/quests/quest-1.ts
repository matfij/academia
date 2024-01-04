import { ENEMY_1 } from '../../enemies/enemies/map-1';
import { MAP_1 } from '../../world/maps/map-1';
import { Quest, QuestState } from '../types';

export const QUEST_1: Quest = {
    uid: 'quest-001',
    state: QuestState.NotStarted,
    currentStep: 0,
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
                position: { x: 100, y: 200 },
            },
            killsRequired: [
                {
                    enemyUid: ENEMY_1.uid,
                    amount: 3,
                },
            ],
            itemsRequired: [],
        },
    ],
};
