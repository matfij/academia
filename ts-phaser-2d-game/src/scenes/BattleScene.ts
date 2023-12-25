import { Scene } from 'phaser';
import { PartyManager } from '../state/PartyManager';
import { EncounterManager } from '../state/EncounterManager';
import { WorldManager } from '../state/WorldManager';

type InteractiveSprite = Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

export class BattleScene extends Scene {
    private allies: InteractiveSprite[] = [];
    private enemies: InteractiveSprite[] = [];

    constructor() {
        super({ key: 'BattleScene' });
    }

    preload() {
        const mapLevel = WorldManager.getCurrentMap();
        this.load.image('battle-bg', `./images/battle-${mapLevel}.png`);

        EncounterManager.getEncounter({ mapLevel }).enemies.forEach((enemy) => {
            this.load.image(enemy.id, `./images/${enemy.id}.png`);
        });

        PartyManager.getParty().forEach((player) => {
            this.load.image(player.id, `./images/${player.id}.png`);
        });
    }

    create() {
        const mapLevel = WorldManager.getCurrentMap();
        this.add.image(400, 200, 'battle-bg');

        let xOffset = 0;
        let yOffset = 0;
        EncounterManager.getEncounter({ mapLevel }).enemies.forEach((enemy) => {
            this.enemies.push(this.physics.add.sprite(700 - xOffset, 100 + yOffset, enemy.id));
            xOffset += 50;
            yOffset += 100;
        });
        
        xOffset = 0;
        yOffset = 0;
        PartyManager.getParty().forEach((ally) => {
            this.allies.push(this.physics.add.sprite(100 + xOffset, 100 + yOffset, ally.id));
            xOffset += 50;
            yOffset += 100;
        });
    }

    update() {
        if (!this.input.keyboard) {
            return;
        }
        const cursors = this.input.keyboard.createCursorKeys();
        if (cursors.space.isDown) {
            this.scene.start('WorldScene');
        }
    }
}
