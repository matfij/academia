
import { Loot } from '../items/types';
import { MapLocation } from '../world/types';

export type Quest = {
    uid: string;
    name: string;
    steps: QuestSetp[];
    questsRequired: Quest[];
    startLocation: MapLocation;
    awards: {
        gold: number;
        loots: Loot[];
    }
};

export enum QuestState {
    Locked = 'Locked',
    NotStarted = 'NotStarted',
    Started = 'Started',
    Completed = 'Completed',
}

export type QuestSetp = {
    message: string;
    location: MapLocation;
    killsRequired: QuestStepKillProgress[];
    itemsRequired: QuestStepItemProgress[];
};

export type QuestStepKillProgress = {
    enemyUid: string;
    amount: number;
};

export type QuestStepItemProgress = {
    itemUid: string;
    amount: number;
};

export type QuestStatus = {
    uid: string;
    description: string;
    state: QuestState;
};
