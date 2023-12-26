import { Enemy } from '../shared/types';

export enum MapLevel {
    MapLevel1 = 'map-1',
}

export class EncounterManager {
    private static readonly ENCOUNTERS: Record<MapLevel, { enemies: Enemy[] }> = {
        'map-1': {
            enemies: [
                { id: 'enemy-1-1', name: 'Green Goblin', attacks: [{ name: 'Small Bash' }] },
                { id: 'enemy-1-2', name: 'Tall Ogre', attacks: [{ name: 'Slow Slash' }] },
                { id: 'enemy-1-3', name: 'Cave Troll', attacks: [{ name: 'Mellow Pierce' }] },
            ],
        },
    };

    public static getEncounter({ mapLevel }: { mapLevel: MapLevel }) {
        return this.ENCOUNTERS[mapLevel];
    }
}
