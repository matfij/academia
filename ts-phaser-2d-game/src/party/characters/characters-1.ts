import { Character, CharacterClass } from '../../.shared/types';

export const CHARACTER_1: Character = {
    uid: 'character-1',
    name: 'Maillard',
    class: CharacterClass.Warrior,
    baseStatistics: {
        health: 400,
        mana: 100,
        physicalDef: 30,
        physicalAtk: 40,
        speed: 20,
        criticalChance: 0.1,
        criticalPower: 1.5,
    },
    potential: {
        health: 40,
        mana: 10,
        physicalDef: 3,
        physicalAtk: 4,
        speed: 2,
        criticalChance: 0,
        criticalPower: 0,
    },
    moves: [
        { uid: 'move-4', name: 'Fist Strike', damage: 15 },
        { uid: 'move-5', name: 'Akrylamid Synthesis', damage: 30 },
    ],
};

export const CHARACTER_2: Character = {
    uid: 'character-2',
    name: 'Partitio',
    class: CharacterClass.Hunter,
    baseStatistics: {
        health: 360,
        mana: 120,
        physicalDef: 20,
        physicalAtk: 30,
        speed: 25,
        criticalChance: 0.15,
        criticalPower: 1.75,
    },
    potential: {
        health: 36,
        mana: 12,
        physicalDef: 2,
        physicalAtk: 3,
        speed: 2.5,
        criticalChance: 0,
        criticalPower: 0,
    },
    moves: [
        { uid: 'move-1', name: 'Bow Shot', damage: 10 },
        { uid: 'move-2', name: 'Luckty Strike', damage: 45 },
    ],
};

export const CHARACTER_3: Character = {
    uid: 'character-3',
    name: 'Amerika',
    class: CharacterClass.Wizzard,
    baseStatistics: {
        health: 300,
        mana: 150,
        physicalDef: 15,
        physicalAtk: 15,
        speed: 25,
        criticalChance: 0.1,
        criticalPower: 1.5,
    },
    potential: {
        health: 30,
        mana: 15,
        physicalDef: 1.5,
        physicalAtk: 1.5,
        speed: 2.5,
        criticalChance: 0,
        criticalPower: 0,
    },
    moves: [
        { uid: 'move-6', name: 'Staff Bash', damage: 5 },
        { uid: 'move-7', name: 'Flash Bolt', damage: 50 },
    ],
};

export const CHARACTER_4: Character = {
    uid: 'character-4',
    name: 'Antoha',
    class: CharacterClass.Hunter,
    baseStatistics: {
        health: 450,
        mana: 125,
        physicalDef: 20,
        physicalAtk: 25,
        speed: 30,
        criticalChance: 0.2,
        criticalPower: 1.5,
    },
    potential: {
        health: 45,
        mana: 12.5,
        physicalDef: 2,
        physicalAtk: 2.5,
        speed: 3,
        criticalChance: 0,
        criticalPower: 0,
    },
    moves: [
        { uid: 'move-6', name: 'Low Kick', damage: 20 },
        { uid: 'move-7', name: 'High Kick', damage: 40 },
    ],
};

export const CHARACTER_5: Character = {
    uid: 'character-5',
    name: 'Oshikko',
    class: CharacterClass.Warrior,
    baseStatistics: {
        health: 350,
        mana: 100,
        physicalDef: 25,
        physicalAtk: 25,
        speed: 25,
        criticalChance: 0.1,
        criticalPower: 1.75,
    },
    potential: {
        health: 35,
        mana: 10,
        physicalDef: 2.5,
        physicalAtk: 2.5,
        speed: 2.5,
        criticalChance: 0,
        criticalPower: 0,
    },
    moves: [
        { uid: 'move-6', name: 'Regular Swing', damage: 10 },
        { uid: 'move-7', name: 'Todomeda', damage: 100 },
    ],
};

export const CHARACTER_6: Character = {
    uid: 'character-6',
    name: 'Nikka',
    class: CharacterClass.Hunter,
    baseStatistics: {
        health: 300,
        mana: 100,
        physicalDef: 20,
        physicalAtk: 25,
        speed: 30,
        criticalChance: 0.2,
        criticalPower: 1.5,
    },
    potential: {
        health: 30,
        mana: 10,
        physicalDef: 2,
        physicalAtk: 2.5,
        speed: 3,
        criticalChance: 0,
        criticalPower: 0,
    },
    moves: [
        { uid: 'move-6', name: 'Piercing Strike', damage: 15 },
        { uid: 'move-7', name: 'Arrow Rain', damage: 40 },
    ],
};
