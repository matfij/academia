import { Enemy } from '../types';

export const ENEMY_1: Enemy = {
    uid: 'enemy-1-1',
    name: 'Green Goblin',
    baseStatistics: {
        speed: 20,
        health: 50,
    },
    moves: [{ uid: 'move-01', name: 'Small Bash', damage: 10 }],
};

export const ENEMY_2: Enemy = {
    uid: 'enemy-1-2',
    name: 'Tall Ogre',
    baseStatistics: {
        speed: 10,
        health: 90,
    },
    moves: [{ uid: 'move-02', name: 'Slow Slash', damage: 20 }],
};

export const ENEMY_3: Enemy = {
    uid: 'enemy-1-3',
    name: 'Cave Troll',
    baseStatistics: {
        speed: 30,
        health: 80,
    },
    moves: [{ uid: 'move-03', name: 'Mellow Pierce', damage: 15 }],
};

export const ENEMY_4: Enemy = {
    uid: 'enemy-1-4',
    name: 'Errant Knight',
    baseStatistics: {
        speed: 100,
        health: 500,
    },
    moves: [{ uid: 'move-04', name: 'Carpe Diem', damage: 200 }],
};

export const ENEMY_5: Enemy = {
    uid: 'enemy-1-5',
    name: 'Agile Goblin',
    baseStatistics: {
        speed: 60,
        health: 70,
    },
    moves: [{ uid: 'move-01', name: 'Small Bash', damage: 15 }],
}

export const ENEMY_6: Enemy = {
    uid: 'enemy-1-6',
    name: 'Young Griffin',
    baseStatistics: {
        speed: 60,
        health: 300,
    },
    moves: [{ uid: 'move-01', name: 'Brave Bird', damage: 50 }],
}
