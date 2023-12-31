import { MapLevel } from './EncounterManager';
import { MAP_1 } from './maps/map-1';

export enum Direction {
    Up,
    Down,
    Left,
    Right,
}

export class WorldManager {
    private static currentMap = {
        name: MapLevel.MapLevel1,
        data: MAP_1,
    };
    private static currentPosition = { x: 100, y: 100 };

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
                this.currentPosition.y = Math.max(0, this.currentPosition.y);
                break;
            }
            case Direction.Down: {
                this.currentPosition.y += MOVEMENT_SPEED;
                this.currentPosition.y = Math.min(600, this.currentPosition.y);
                break;
            }
            case Direction.Left: {
                this.currentPosition.x -= MOVEMENT_SPEED;
                this.currentPosition.x = Math.max(0, this.currentPosition.x);
                break;
            }
            case Direction.Right: {
                this.currentPosition.x += MOVEMENT_SPEED;
                this.currentPosition.x = Math.min(1100, this.currentPosition.x);
                break;
            }
        }
        return this.currentPosition;
    }
}
