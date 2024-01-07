import { QuestManager } from '../quests/QuestManager';
import { chance } from '../shared/math';
import { comparePositions } from '../shared/utils';
import { getMap } from './all-maps';
import { MAP_1 } from './maps/map-1';
import { Direction, Point, TileType } from './types';

export class WorldManager {
    private static currentMap = MAP_1;
    private static currentPosition = { x: 10, y: 180 };
    private static lastPositionUpdate = Date.now();
    private static readonly MAP_WIDTH = 1090;
    private static readonly MAP_HEIGHT = 590;
    private static readonly MOVEMENT_SPEED = 10;
    private static readonly MOVEMENT_INTERVAL_MS = 100;

    public static getCurrentMap() {
        const map = { ...this.currentMap };
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
        return { ...this.currentPosition };
    }

    public static moveParty({ direction }: { direction: Direction | undefined }) {
        if (!direction || Date.now() < this.lastPositionUpdate + this.MOVEMENT_INTERVAL_MS) {
            return {
                position: { ...this.currentPosition },
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
        const newMapData = this.checkPassageTile(this.currentPosition);
        if (newMapData) {
            this.lastPositionUpdate = Date.now() + 10 * this.MOVEMENT_INTERVAL_MS;
        }
        let encounter = false;
        if (this.checkCollisionTile(this.currentPosition)) {
            this.currentPosition = oldPosition;
        }
        const questData = this.checkQuestTile(this.currentPosition);
        const bossData = this.checkBossTile(this.currentPosition);
        if (!comparePositions(oldPosition, this.currentPosition) && !questData && !bossData) {
            encounter = this.checkEncounter();
        }
        return {
            position: { ...this.currentPosition },
            questData,
            bossData,
            newMapData,
            encounter,
        };
    }

    private static checkEncounter() {
        return chance(this.getCurrentMap().encounterRate);
    }

    private static checkCollisionTile(position: Point) {
        const tile = this.getTile(position);
        return tile?.type === TileType.Wall;
    }

    private static checkQuestTile(position: Point) {
        const tile = this.getTile(position);
        if (!tile.questData) {
            return;
        }
        const { description, state } = QuestManager.getQuestDescription({
            questUid: tile.questData.questUid,
        });
        return { uid: tile.questData.questUid, description: description, state: state };
    }

    private static checkPassageTile(position: Point) {
        const tile = this.getTile(position);
        if (!tile.passageData) {
            return;
        }
        const newMap = getMap({ uid: tile.passageData.mapUid });
        this.currentMap = newMap;
        this.currentPosition = { ...tile.passageData.position };
        return { ...newMap };
    }

    private static checkBossTile(position: Point) {
        const tile = this.getTile(position);
        if (!tile.bossData) {
            return;
        }
        return tile.bossData;
    }

    private static getTile(position: Point) {
        const tile = this.getCurrentMap().tiles.find((t) => comparePositions(t.position, position));
        if (!tile) {
            throw new Error('Invalid position');
        }
        return tile;
    }
}
