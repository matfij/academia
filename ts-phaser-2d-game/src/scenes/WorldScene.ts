import { Scene } from 'phaser';
import { Direction, WorldManager } from '../state/WorldManager';

export class WorldScene extends Scene {
    private party?: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    private extraEncounterChance = 0;
    private backgroundMusic: Phaser.Sound.BaseSound | null = null;

    constructor() {
        super({ key: 'WorldScene' });
    }

    preload() {
        const mapLevel = WorldManager.getCurrentMap();
        this.load.image('adventure-bg', `./images/adventure-${mapLevel}.png`);
        this.load.audio('adventure-bg-music', `./music/adventure-${mapLevel}.mp3`);

        this.load.image('party', './images/adventure-player-1.png');
    }

    create() {
        this.extraEncounterChance = 0;

        this.add.image(400, 200, 'adventure-bg');
        if (this.backgroundMusic && !this.backgroundMusic.isPlaying) {
            this.backgroundMusic.resume();
        } else if (!this.backgroundMusic || !this.backgroundMusic.isPlaying) {
            this.backgroundMusic = this.sound.add('adventure-bg-music', { volume: 0.5, loop: true });
            this.backgroundMusic.play();
        }
        this.tweens.add({
            targets: this.backgroundMusic,
            volume: 0.5,
            duration: 1000,
        });

        const partyPosition = WorldManager.getCurrentPosition();
        this.party = this.physics.add.sprite(partyPosition.x, partyPosition.y, 'party');
    }

    update() {
        if (!this.party || !this.input.keyboard) {
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
            this.startBattleScene();
        } else {
            this.extraEncounterChance -= 0.0000025;
        }
    }

    private shouldTriggerBattle(): boolean {
        const randomChance = Math.random() + this.extraEncounterChance;
        return randomChance < 0.0001;
    }

    startBattleScene() {
        this.extraEncounterChance = 0;
        this.tweens.add({
            targets: this.backgroundMusic,
            volume: 0,
            duration: 1000,
            destroy: false,
            pause: true,            
            onComplete: () => {
                this.scene.start('BattleScene');
            },
        });
    }
}
