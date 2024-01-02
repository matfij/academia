import { Scene } from 'phaser';
import { Direction, WorldManager } from './WorldManager';
import { AudioManager } from '../shared/AudioManager';
import { Tile, TileType } from './types';

export class WorldScene extends Scene {
    private tiles: (Tile & { rect: Phaser.GameObjects.Rectangle })[] = [];
    private party?: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    private extraEncounterChance = 0;
    private inBattle = false;
    private onStartBattle: () => void;
    private adventureMusicProgress = 0;

    constructor({ onStartBattle }: { onStartBattle: () => void }) {
        super({ key: 'WorldScene' });
        this.onStartBattle = onStartBattle;
    }

    preload() {
        const mapData = WorldManager.getCurrentMap();
        this.load.image('adventure-bg', `./images/adventure-${mapData.name}.png`);
        this.load.image('party', './images/adventure-player-1.png');
    }

    create() {
        this.extraEncounterChance = 0;
        // this.add.image(400, 200, 'adventure-bg');
        const mapData = WorldManager.getCurrentMap();
        AudioManager.play({ url: `./music/adventure-${mapData.name}.mp3`, volume: 0.1, progress: 0 });
        const partyPosition = WorldManager.getCurrentPosition();
        mapData.data.forEach((tile) => {
            const { x, y } = tile.position;
            const color = this.getColorForTile(tile.type);
            const rect = this.add.rectangle(x, y, 9, 9, color, 0.9).setOrigin(0, 0);
            this.tiles.push({ rect, ...tile });
        });
        this.party = this.physics.add.sprite(partyPosition.x, partyPosition.y, 'party');
    }

    private getColorForTile(tileType: TileType) {
        switch (tileType) {
            case TileType.Route:
                return 0x22dd22;
            case TileType.Wall:
                return 0x424242;
            case TileType.Passage:
                return 0x2211dd;
            case TileType.Quest:
                return 0xffff00;
            case TileType.Boss:
                return 0xdd1122;
            default:
                return 0xffffff77;
        }
    }

    update() {
        if (this.inBattle || !this.party || !this.input.keyboard) {
            return;
        }

        const cursors = this.input.keyboard.createCursorKeys();
        let partyPosition = WorldManager.getCurrentPosition();
        let moved = false;

        if (cursors.left.isDown) {
            partyPosition = WorldManager.moveParty({ direction: Direction.Left });
            moved = true;
        } else if (cursors.right.isDown) {
            partyPosition = WorldManager.moveParty({ direction: Direction.Right });
            moved = true;
        }
        if (cursors.up.isDown) {
            partyPosition = WorldManager.moveParty({ direction: Direction.Up });
            moved = true;
        } else if (cursors.down.isDown) {
            partyPosition = WorldManager.moveParty({ direction: Direction.Down });
            moved = true;
        }

        this.party.setPosition(partyPosition.x, partyPosition.y);

        if (moved && this.shouldTriggerBattle()) {
            this.startBattle();
        } else {
            this.extraEncounterChance -= 0.0000025;
        }
    }

    private shouldTriggerBattle(): boolean {
        const randomChance = Math.random() + this.extraEncounterChance;
        return randomChance < 0.0001;
    }

    startBattle() {
        this.inBattle = true;
        this.extraEncounterChance = 0;
        this.adventureMusicProgress = 0.9 * AudioManager.getProgress();
        const mapLevel = WorldManager.getCurrentMap().name;
        AudioManager.play({ url: `./music/battle-${mapLevel}.mp3`, volume: 0.1, progress: 0 });
        this.onStartBattle();
    }

    public endBattle() {
        this.inBattle = false;
        const mapLevel = WorldManager.getCurrentMap().name;
        AudioManager.play({
            url: `./music/adventure-${mapLevel}.mp3`,
            volume: 0.1,
            progress: this.adventureMusicProgress,
        });
    }
}
