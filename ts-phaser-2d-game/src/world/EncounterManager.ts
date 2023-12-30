import { Character } from '../shared/types';
import { uuid } from '../shared/utils';

export enum MapLevel {
    MapLevel1 = 'map-1',
}

type Enemy = Character & { uid: string; chance: number };

export class EncounterManager {
    private static readonly ENCOUNTERS: Record<MapLevel, { enemies: Enemy[] }> = {
        'map-1': {
            enemies: [
                {
                    id: 'enemy-1-1',
                    uid: 'enemy-1-1',
                    name: 'Green Goblin',
                    baseStatistics: {
                        speed: 20,
                        health: 50,
                    },
                    moves: [{ id: 'move-01', name: 'Small Bash', damage: 10 }],
                    chance: 0.7,
                },
                {
                    id: 'enemy-1-2',
                    uid: 'enemy-1-2',
                    name: 'Tall Ogre',
                    baseStatistics: {
                        speed: 10,
                        health: 90,
                    },
                    moves: [{ id: 'move-02', name: 'Slow Slash', damage: 20 }],
                    chance: 0.5,
                },
                {
                    id: 'enemy-1-3',
                    uid: 'enemy-1-3',
                    name: 'Cave Troll',
                    baseStatistics: {
                        speed: 30,
                        health: 80,
                    },
                    moves: [{ id: 'move-03', name: 'Mellow Pierce', damage: 15 }],
                    chance: 0.3,
                },
                {
                    id: 'enemy-1-4',
                    uid: 'enemy-1-4',
                    name: 'Errant Knight',
                    baseStatistics: {
                        speed: 999,
                        health: 500,
                    },
                    moves: [{ id: 'move-04', name: 'Carpe Diem', damage: 200 }],
                    chance: 0.1,
                },
            ],
        },
    };

    public static getEncounter({ mapLevel }: { mapLevel: MapLevel }) {
        const encounter = this.ENCOUNTERS[mapLevel];
        const randomizedEnemies = this.randomizeEnemyGroup(encounter.enemies);
        return { ...encounter, enemies: randomizedEnemies };
    }

    private static randomizeEnemyGroup(enemies: Enemy[]) {
        const groupSize = this.calculateGroupSize();
        const randomizedEnemies: Enemy[] = [];
        for (let i = 0; i < groupSize; i++) {
            const randomIndex = this.getRandomIndexBasedOnChance(enemies);
            randomizedEnemies.push({ ...enemies[randomIndex], id: uuid() });
        }
        return randomizedEnemies;
    }

    private static calculateGroupSize() {
        const probabilities = [0.4, 0.3, 0.2, 0.1];
        const cumulativeProbabilities = probabilities.reduce((acc, prob) => {
            acc.push(acc.length === 0 ? prob : acc[acc.length - 1] + prob);
            return acc;
        }, [] as number[]);
        const randomValue = Math.random();
        let groupSize = 2;
        for (let i = 0; i < cumulativeProbabilities.length; i++) {
            if (randomValue < cumulativeProbabilities[i]) {
                groupSize = i + 2;
                break;
            }
        }
        return groupSize;
    }

    private static getRandomIndexBasedOnChance(enemies: Enemy[]) {
        const totalChance = enemies.reduce((sum, enemy) => sum + enemy.chance, 0);
        let randomValue = Math.random() * totalChance;
        for (let i = 0; i < enemies.length; i++) {
            randomValue -= enemies[i].chance;
            if (randomValue <= 0) {
                return i;
            }
        }
        return enemies.length - 1;
    }
}
