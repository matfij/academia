import { SceneTileType } from './types';

export class MapManager {
    public static createEmptyMap(rows: number, columns: number) {
        const emptyMap: SceneTileType[][] = [];
        for (let row = 0; row < rows; row++) {
            const row: SceneTileType[] = [];
            for (let col = 0; col < columns; col++) {
                row.push(SceneTileType.Route);
            }
            emptyMap.push(row);
        }
        return emptyMap;
    }

    public static printMap(map: SceneTileType[][], scale: number) {
        let printedMap = '[';
        for (let row = 0; row < map.length; row++) {
            for (let col = 0; col < map[0].length; col++) {
                const tile = {
                    position: { x: scale * col, y: scale * row },
                    type: map[row][col],
                };
                if (tile.type === SceneTileType.Empty) {
                    continue;
                }
                printedMap += `${JSON.stringify(tile)},`
                    .replace('"Collision"', 'SceneTileType.Collision')
                    .replace('"Route"', 'SceneTileType.Route')
                    .replace('"SafeRoute"', 'SceneTileType.SafeRoute')
                    .replace('"Passage"', 'SceneTileType.Passage')
                    .replace('"Quest"', 'SceneTileType.Quest')
                    .replace('"Encounter"', 'SceneTileType.Encounter')
                    .replace('"Npc"', 'SceneTileType.Npc');
            }
        }
        printedMap += ']';
        return printedMap;
    }
}
