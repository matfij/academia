import { MapLocation } from '../world/types';

export type Quest = {
    uid: string;
    state: QuestState,
    steps: QuestSetp[];
    currentStep: number;
    questsRequired: Quest[];
    startLocation: MapLocation;
};

export enum QuestState {
    Locked = 'Locked',
    NotStarted = 'NotStarted',
    Stated = 'Started',
    Completed = 'Completed'
}

export type QuestSetp = {
    message: string;
    location: MapLocation;
    killsRequired: {
        enemyUid: string;
        amount: number;
    }[];
    itemsRequired: {
        itemUid: string;
        amount: number;
    }[];
};
