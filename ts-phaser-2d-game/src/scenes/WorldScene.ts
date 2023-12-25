import { Scene } from 'phaser';
import { Direction, WorldManager } from '../state/WorldManager';

export class WorldScene extends Scene {
    private party?: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    private extraEncounterChance = 0;

    constructor() {
        super({ key: 'WorldScene' });
    }

    preload() {
        this.load.image('world', './images/adventure-map-1.png');
        this.load.image('party', './images/adventure-player-1.png');
    }

    create() {
        this.add.image(400, 200, 'world');

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
            this.scene.start('BattleScene');
            this.extraEncounterChance = 0;
        } else {
            this.extraEncounterChance -= 0.0000025;
        }
    }

    private shouldTriggerBattle(): boolean {
        const randomChance = Math.random() + this.extraEncounterChance;
        return randomChance < 0.0001;
    }
}
