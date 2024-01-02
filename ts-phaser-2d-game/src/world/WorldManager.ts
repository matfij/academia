import { MapLevel } from './EncounterManager';
import { MAP_1 } from './maps/map-1';
import { TileType } from './types';

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
    private static currentPosition = { x: 10, y: 590 };
    private static lastPositionUpdate = Date.now();
    private static readonly MAP_WIDTH = 1100;
    private static readonly MAP_HEIGHT = 600;
    private static readonly MOVEMENT_SPEED = 10;
    private static readonly MOVEMENT_INTERVAL_MS = 100;

    public static getCurrentMap() {
        return this.currentMap;
    }

    public static getCurrentPosition() {
        return this.currentPosition;
    }

    public static moveParty({ direction }: { direction: Direction }) {
        if (Date.now() < this.lastPositionUpdate + this.MOVEMENT_INTERVAL_MS) {
            return this.currentPosition;
        }
        this.lastPositionUpdate = Date.now();
        const oldPosition = { ...this.currentPosition };
        switch (direction) {
            case Direction.Up: {
                this.currentPosition.y -= this.MOVEMENT_SPEED;
                this.currentPosition.y = Math.max(0, this.currentPosition.y);
                break;
            }
            case Direction.Down: {
                this.currentPosition.y += this.MOVEMENT_SPEED;
                this.currentPosition.y = Math.min(this.MAP_HEIGHT, this.currentPosition.y);
                break;
            }
            case Direction.Left: {
                this.currentPosition.x -= this.MOVEMENT_SPEED;
                this.currentPosition.x = Math.max(0, this.currentPosition.x);
                break;
            }
            case Direction.Right: {
                this.currentPosition.x += this.MOVEMENT_SPEED;
                this.currentPosition.x = Math.min(this.MAP_WIDTH, this.currentPosition.x);
                break;
            }
        }
        if (this.checkCollisionTile(this.currentPosition)) {
            this.currentPosition = oldPosition;
        }
        return this.currentPosition;
    }

    private static checkCollisionTile({ x, y }: { x: number; y: number }) {
        const tile = this.currentMap.data.find((t) => t.position.x === x && t.position.y === y);
        return tile?.type === TileType.Wall;
    }
}
