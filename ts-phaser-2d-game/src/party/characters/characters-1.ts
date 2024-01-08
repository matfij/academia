import { Character } from '../../shared/types';

export const CHARACTER_1: Character = {
    uid: 'character-1',
    name: 'Maillard',
    baseStatistics: {
        speed: 20,
        health: 400,
    },
    moves: [
        { uid: 'move-4', name: 'Fist Strike', damage: 15 },
        { uid: 'move-5', name: 'Akrylamid Synthesis', damage: 30 },
    ],
};

export const CHARACTER_2: Character = {
    uid: 'character-2',
    name: 'Partitio',
    baseStatistics: {
        speed: 30,
        health: 360,
    },
    moves: [
        { uid: 'move-1', name: 'Bow Shot', damage: 10 },
        { uid: 'move-2', name: 'Luckty Strike', damage: 45 },
    ],
};

export const CHARACTER_3: Character = {
    uid: 'character-3',
    name: 'Amerika',
    baseStatistics: {
        speed: 25,
        health: 250,
    },
    moves: [
        { uid: 'move-6', name: 'Staff Bash', damage: 5 },
        { uid: 'move-7', name: 'Flash Bolt', damage: 50 },
    ],
};

export const CHARACTER_4: Character = {
    uid: 'character-4',
    name: 'Antoha',
    baseStatistics: {
        speed: 40,
        health: 300,
    },
    moves: [
        { uid: 'move-6', name: 'Low Kick', damage: 20 },
        { uid: 'move-7', name: 'High Kick', damage: 40 },
    ],
};

export const CHARACTER_5: Character = {
    uid: 'character-5',
    name: 'Oshikko',
    baseStatistics: {
        speed: 30,
        health: 200,
    },
    moves: [
        { uid: 'move-6', name: 'Regular Swing', damage: 10 },
        { uid: 'move-7', name: 'Todomeda', damage: 100 },
    ],
};

export const CHARACTER_6: Character = {
    uid: 'character-6',
    name: 'Nikka',
    baseStatistics: {
        speed: 45,
        health: 300,
    },
    moves: [
        { uid: 'move-6', name: 'Piercing Strike', damage: 15 },
        { uid: 'move-7', name: 'Arrow Rain', damage: 40 },
    ],
};
