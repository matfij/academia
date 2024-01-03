import { Character } from '../../shared/types';

export const CHARACTER_1: Character = {
    uid: 'player-1',
    name: 'Gengar II',
    baseStatistics: {
        speed: 100,
        health: 100,
    },
    moves: [
        { uid: 'move-4', name: 'Sword Swing', damage: 10 },
        { uid: 'move-5', name: 'Swallow Blade', damage: 30 },
    ],
};

export const CHARACTER_2: Character = {
    uid: 'player-2',
    name: 'Astrolfo',
    baseStatistics: {
        speed: 225,
        health: 180,
    },
    moves: [
        { uid: 'move-1', name: 'Lance Strike', damage: 10 },
        { uid: 'move-2', name: 'Wind Thrust', damage: 45 },
        { uid: 'move-3', name: 'Bolt of Bahamut', damage: 75 },
    ],
};
export const CHARACTER_3: Character = {
    uid: 'player-3',
    name: 'Arabella',
    baseStatistics: {
        speed: 10,
        health: 1000,
    },
    moves: [
        { uid: 'move-6', name: 'Regular Swing', damage: 10 },
        { uid: 'move-7', name: 'Piercing Strike', damage: 30 },
        { uid: 'move-8', name: 'Fervent Qilin Slash', damage: 90 },
        { uid: 'move-9', name: 'Black Dragon', damage: 200 },
    ],
};
