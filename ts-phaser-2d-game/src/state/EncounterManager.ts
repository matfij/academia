export enum MapLevel {
    MapLevel1 = 'map-1',
}

export class EncounterManager {
    private static readonly ENCOUNTERS: Record<MapLevel, { enemies: { id: string }[] }> = {
        'map-1': { enemies: [{ id: 'enemy-1-1' }, { id: 'enemy-1-2' }, { id: 'enemy-1-3' }] },
    };

    public static getEncounter({ mapLevel }: { mapLevel: MapLevel }) {
        return this.ENCOUNTERS[mapLevel];
    }
}
