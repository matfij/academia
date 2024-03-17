import { MapTileType } from './types';

export class MapManager {
    public static createEmptyMap(rows: number, columns: number) {
        const emptyMap: MapTileType[][] = [];
        for (let row = 0; row < rows; row++) {
            const row: MapTileType[] = [];
            for (let col = 0; col < columns; col++) {
                row.push(MapTileType.Route);
            }
            emptyMap.push(row);
        }
        return emptyMap;
    }

    public static printMap(map: MapTileType[][], scale: number) {
        let printedMap = '[';
        for (let row = 0; row < map.length; row++) {
            for (let col = 0; col < map[0].length; col++) {
                const tile = {
                    position: { x: scale * col, y: scale * row },
                    type: map[row][col],
                };
                if (tile.type === MapTileType.Empty) {
                    continue;
                }
                printedMap += `${JSON.stringify(tile)},`
                    .replace('"Collision"', 'MapTileType.Collision')
                    .replace('"Route"', 'MapTileType.Route')
                    .replace('"SafeRoute"', 'MapTileType.SafeRoute')
                    .replace('"Passage"', 'MapTileType.Passage')
                    .replace('"Quest"', 'MapTileType.Quest')
                    .replace('"Encounter"', 'MapTileType.Encounter')
                    .replace('"Npc"', 'MapTileType.Npc');
            }
        }
        printedMap += ']';
        return printedMap;
    }
}
