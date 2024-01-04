import { QuestManager } from '../quests/QuestManager';
import { chance } from '../shared/math';
import { comparePositions } from '../shared/utils';
import { MAP_1 } from './maps/map-1';
import { Direction, Point, TileType } from './types';

export class WorldManager {
    private static currentMap = MAP_1;
    private static currentPosition = { x: 750, y: 490 };
    private static lastPositionUpdate = Date.now();
    private static readonly MAP_WIDTH = 1100;
    private static readonly MAP_HEIGHT = 600;
    private static readonly MOVEMENT_SPEED = 10;
    private static readonly MOVEMENT_INTERVAL_MS = 100;

    public static getCurrentMap() {
        const map = this.currentMap;
        const quests = QuestManager.getQuestsForMap({ mapUid: map.uid });
        quests.forEach((quest) => {
            map.tiles = map.tiles.map((tile) =>
                tile.position.x === quest.position.x && tile.position.y === quest.position.y
                    ? { ...tile, type: TileType.Quest, questData: { questUid: quest.questUid } }
                    : tile,
            );
        });
        return map;
    }

    public static getCurrentPosition() {
        return this.currentPosition;
    }

    public static moveParty({ direction }: { direction: Direction | undefined }) {
        if (!direction || Date.now() < this.lastPositionUpdate + this.MOVEMENT_INTERVAL_MS) {
            return {
                position: this.currentPosition,
            };
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
        let encounter = false;
        if (this.checkCollisionTile(this.currentPosition)) {
            this.currentPosition = oldPosition;
        }
        const questStatus = this.checkQuestTile(this.currentPosition);
        if (!comparePositions(oldPosition, this.currentPosition) && !questStatus) {
            encounter = this.checkEncounter();
        }
        return {
            position: this.currentPosition,
            questStatus: questStatus,
            encounter: encounter,
        };
    }

    // private static getQuestData({ mapUid }: { mapUid: string }) {
    //     const quests = QuestManager.getQuestsForMap({ mapUid });
    // }

    private static checkEncounter() {
        return chance(this.currentMap.encounterRate);
    }

    private static checkCollisionTile({ x, y }: Point) {
        const tile = this.currentMap.tiles.find((t) => t.position.x === x && t.position.y === y);
        return tile?.type === TileType.Wall;
    }

    private static checkQuestTile({ x, y }: Point) {
        const tile = this.currentMap.tiles.find((t) => t.position.x === x && t.position.y === y);
        if (tile?.type === TileType.Quest && tile.questData) {
            const { description, state } = QuestManager.getQuestDescription({
                questUid: tile.questData.questUid,
            });
            return { uid: tile.questData.questUid, description: description, state: state };
        }
    }
}
