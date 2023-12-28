import { Enemy } from '../shared/types';

export enum MapLevel {
    MapLevel1 = 'map-1',
}

export class EncounterManager {
    private static readonly ENCOUNTERS: Record<MapLevel, { enemies: Enemy[] }> = {
        'map-1': {
            enemies: [
                {
                    id: 'enemy-1-1',
                    name: 'Green Goblin',
                    statistics: {
                        speed: 20,
                        health: 30,
                    },
                    moves: [{ id: 'move-01', name: 'Small Bash', damage: 10 }],
                },
                {
                    id: 'enemy-1-2',
                    name: 'Tall Ogre',
                    statistics: {
                        speed: 10,
                        health: 40,
                    },
                    moves: [{ id: 'move-02', name: 'Slow Slash', damage: 10 }],
                },
                {
                    id: 'enemy-1-3',
                    name: 'Cave Troll',
                    statistics: {
                        speed: 30,
                        health: 60,
                    },
                    moves: [{ id: 'move-03', name: 'Mellow Pierce', damage: 10 }],
                },
            ],
        },
    };

    public static getEncounter({ mapLevel }: { mapLevel: MapLevel }) {
        return this.ENCOUNTERS[mapLevel];
    }
}
