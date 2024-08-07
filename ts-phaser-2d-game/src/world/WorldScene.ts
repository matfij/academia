import { Scene } from 'phaser';
import { WorldManager } from './WorldManager';
import { AudioManager } from '../.shared/AudioManager';
import { Direction, DisplayTile, Tile, TileBossData, TileType } from './types';
import { QuestStatus } from '../quests/types';

export class WorldScene extends Scene {
    private tiles: DisplayTile[] = [];
    private party?: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    private blockMovement = false;
    private onStartBattle: ({ bossData }: { bossData?: TileBossData }) => void;
    private onShowQuest: ({ uid, description }: QuestStatus) => void;
    private adventureMusicProgress = 0;

    constructor({
        onStartBattle,
        onShowQuest,
    }: {
        onStartBattle: ({ bossData }: { bossData?: TileBossData }) => void;
        onShowQuest: ({ uid, description }: QuestStatus) => void;
    }) {
        super({ key: 'WorldScene' });
        this.onStartBattle = onStartBattle;
        this.onShowQuest = onShowQuest;
    }

    preload() {
        // map-agnostic assets
        this.load.image('party', './images/adventure-player.png');
    }

    create() {
        this.loadMap();
    }

    update() {
        if (this.blockMovement || !this.party || !this.input.keyboard) {
            return;
        }
        const cursors = this.input.keyboard.createCursorKeys();
        const moveResult = WorldManager.moveParty({
            direction: cursors.left.isDown
                ? Direction.Left
                : cursors.right.isDown
                ? Direction.Right
                : cursors.up.isDown
                ? Direction.Up
                : cursors.down.isDown
                ? Direction.Down
                : undefined,
        });
        if (moveResult.newMapData) {
            this.loadMap();
        } else if (moveResult.questData) {
            this.showQuest({
                uid: moveResult.questData.uid,
                description: moveResult.questData.description,
                state: moveResult.questData.state,
            });
        } else if (moveResult.encounter || moveResult.bossData) {
            this.startBattle({ bossData: moveResult.bossData });
        }
        this.party.setPosition(moveResult.position.x, moveResult.position.y);
    }

    public loadMap() {
        const mapData = WorldManager.getCurrentMap();
        this.load.image(`adventure-bg-${mapData.uid}`, `./images/adventure-${mapData.uid}.png`);
        this.load.start();
        setTimeout(() => {
            this.add.image(550, 300, `adventure-bg-${mapData.uid}`);
            AudioManager.play({ url: `./music/adventure-${mapData.uid}.mp3`, volume: 0.1, progress: 0 });
            this.adventureMusicProgress = 0;
            this.drawTiles({ tiles: mapData.tiles });
            const partyPosition = WorldManager.getCurrentPosition();
            this.party?.destroy();
            this.party = this.physics.add
                .sprite(partyPosition.x, partyPosition.y, 'party')
                .setOrigin(0, 0)
                .setDepth(1);
            this.cameras.main.setSize(this.scale.width, this.scale.height);
            this.cameras.main.startFollow(this.party, true, 0.1, 0.1);
            this.cameras.main.setZoom(2);
        }, 100);
    }

    public drawTiles({ tiles }: { tiles: Tile[] }) {
        this.tiles.forEach((t) => t.spriteRef?.destroy());
        tiles.forEach((tile) => {
            const rect = this.getTileRect({ tile });
            this.tiles.push({ ...tile, spriteRef: rect });
        });
    }

    private getTileRect({ tile }: { tile: Tile }) {
        switch (tile.type) {
            case TileType.Route:
                return this.add
                    .rectangle(tile.position.x, tile.position.y, 9, 9, 0x22dd22, 0.2)
                    .setOrigin(0, 0);
            case TileType.Wall:
                return this.add
                    .rectangle(tile.position.x, tile.position.y, 9, 9, 0x424242, 0.4)
                    .setOrigin(0, 0);
            case TileType.Passage:
                return this.add.rectangle(tile.position.x, tile.position.y, 9, 9, 0x2211dd).setOrigin(0, 0);
            case TileType.Quest:
                return this.add.rectangle(tile.position.x, tile.position.y, 9, 9, 0xffff00).setOrigin(0, 0);
            case TileType.Boss:
                return this.add.rectangle(tile.position.x, tile.position.y, 9, 9, 0xdd1122).setOrigin(0, 0);
        }
    }

    private startBattle({ bossData }: { bossData?: TileBossData }) {
        this.blockMovement = true;
        this.adventureMusicProgress = 0.9 * AudioManager.getProgress();
        const mapLevel = WorldManager.getCurrentMap();
        const musicUrl = bossData?.musicPath
            ? `./music/${bossData.musicPath}`
            : `./music/battle-${mapLevel.uid}.mp3`;
        AudioManager.play({ url: musicUrl, volume: 0.1, progress: 0 });
        this.onStartBattle({ bossData });
    }

    public endBattle() {
        this.blockMovement = false;
        const mapLevel = WorldManager.getCurrentMap();
        AudioManager.play({
            url: `./music/adventure-${mapLevel.uid}.mp3`,
            volume: 0.1,
            progress: this.adventureMusicProgress,
        });
    }

    private showQuest({ uid, description, state }: QuestStatus) {
        this.blockMovement = true;
        this.onShowQuest({ uid, description, state });
    }

    public hideQuest() {
        this.blockMovement = false;
    }
}
