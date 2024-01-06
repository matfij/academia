import { TileType } from './types';

export class MapManager {
    public static createEmptyMap(rows: number, columns: number) {
        const emptyMap: TileType[][] = [];
        for (let row = 0; row < rows; row++) {
            const row: TileType[] = [];
            for (let col = 0; col < columns; col++) {
                row.push(TileType.Route);
            }
            emptyMap.push(row);
        }
        return emptyMap;
    }

    public static printMap(map: TileType[][], scale: number) {
        let printedMap = '[';
        for (let row = 0; row < map.length; row++) {
            for (let col = 0; col < map[0].length; col++) {
                const tile = {
                    position: { x: scale * col, y: scale * row },
                    type: map[row][col],
                };
                printedMap += `${JSON.stringify(tile)},`
                    .replace('"Wall"', 'TileType.Wall')
                    .replace('"Route"', 'TileType.Route')
                    .replace('"Passage"', 'TileType.Passage')
                    .replace('"Quest"', 'TileType.Quest')
                    .replace('"Boss"', 'TileType.Boss');
            }
        }
        printedMap += ']';
        return printedMap;
    }
}
