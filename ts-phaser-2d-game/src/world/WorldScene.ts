import { Scene } from 'phaser';
import { WorldManager } from './WorldManager';
import { AudioManager } from '../shared/AudioManager';
import { Direction, Tile, TileType } from './types';
import { QuestStatus } from '../quests/types';

export class WorldScene extends Scene {
    private tiles: (Tile & { rect: Phaser.GameObjects.Rectangle })[] = [];
    private party?: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    private blockMovement = false;
    private onStartBattle: () => void;
    private onShowQuest: ({ uid, description }: QuestStatus) => void;
    private adventureMusicProgress = 0;

    constructor({
        onStartBattle,
        onShowQuest,
    }: {
        onStartBattle: () => void;
        onShowQuest: ({ uid, description }: QuestStatus) => void;
    }) {
        super({ key: 'WorldScene' });
        this.onStartBattle = onStartBattle;
        this.onShowQuest = onShowQuest;
    }

    preload() {
        const mapData = WorldManager.getCurrentMap();
        this.load.image('adventure-bg', `./images/adventure-${mapData.uid}.png`);
        this.load.image('party', './images/adventure-player.png');
    }

    create() {
        const mapData = WorldManager.getCurrentMap();
        AudioManager.play({ url: `./music/adventure-${mapData.uid}.mp3`, volume: 0.1, progress: 0 });
        this.add.image(550, 300, 'adventure-bg');
        mapData.tiles.forEach((tile) => {
            const rect = this.getTileRect({ tile });
            this.tiles.push({ rect, ...tile });
        });
        const partyPosition = WorldManager.getCurrentPosition();
        this.party = this.physics.add.sprite(partyPosition.x, partyPosition.y, 'party').setOrigin(0, 0);
        this.cameras.main.setSize(this.scale.width, this.scale.height);
        this.cameras.main.startFollow(this.party, true, 0.1, 0.1);
        this.cameras.main.setZoom(2);
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
        if (moveResult.encounter) {
            this.startBattle();
        }
        if (moveResult.questStatus) {
            this.showQuest({
                uid: moveResult.questStatus.uid,
                description: moveResult.questStatus.description,
                state: moveResult.questStatus.state,
            });
        }

        this.party.setPosition(moveResult.position.x, moveResult.position.y);
    }

    private getTileRect({ tile }: { tile: Tile }) {
        switch (tile.type) {
            case TileType.Route:
                return this.add
                    .rectangle(tile.position.x, tile.position.y, 9, 9, 0x22dd22, 0.3)
                    .setOrigin(0, 0);
            case TileType.Wall:
                return this.add
                    .rectangle(tile.position.x, tile.position.y, 9, 9, 0x424242, 0.6)
                    .setOrigin(0, 0);
            case TileType.Passage:
                return this.add.rectangle(tile.position.x, tile.position.y, 9, 9, 0x2211dd).setOrigin(0, 0);
            case TileType.Quest:
                return this.add.rectangle(tile.position.x, tile.position.y, 9, 9, 0xffff00).setOrigin(0, 0);
            case TileType.Boss:
                return this.add.rectangle(tile.position.x, tile.position.y, 9, 9, 0xdd1122).setOrigin(0, 0);
        }
    }

    private startBattle() {
        this.blockMovement = true;
        this.adventureMusicProgress = 0.9 * AudioManager.getProgress();
        const mapLevel = WorldManager.getCurrentMap();
        AudioManager.play({ url: `./music/battle-${mapLevel.uid}.mp3`, volume: 0.1, progress: 0 });
        this.onStartBattle();
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
