import { MapLevel } from './EncounterManager';

export enum Direction {
    Up,
    Down,
    Left,
    Right,
}

export class WorldManager {
    private static currentMap: MapLevel = MapLevel.MapLevel1;
    private static currentPosition: { x: number; y: number } = { x: 100, y: 100 };

    public static getCurrentMap() {
        return this.currentMap;
    }

    public static getCurrentPosition() {
        return this.currentPosition;
    }

    public static moveParty({ direction }: { direction: Direction }) {
        const MOVEMENT_SPEED = 1;
        switch (direction) {
            case Direction.Up: {
                this.currentPosition.y -= MOVEMENT_SPEED;
                break;
            }
            case Direction.Down: {
                this.currentPosition.y += MOVEMENT_SPEED;
                break;
            }
            case Direction.Left: {
                this.currentPosition.x -= MOVEMENT_SPEED;
                break;
            }
            case Direction.Right: {
                this.currentPosition.x += MOVEMENT_SPEED;
                break;
            }
        }
        return this.currentPosition;
    }
}
