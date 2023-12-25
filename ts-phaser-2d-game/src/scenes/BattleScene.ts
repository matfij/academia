import { Scene } from 'phaser';
import { PartyManager } from '../state/PartyManager';
import { EncounterManager } from '../state/EncounterManager';
import { WorldManager } from '../state/WorldManager';

type InteractiveSprite = Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

export class BattleScene extends Scene {
    private backgroundMusic: Phaser.Sound.BaseSound | null = null;
    private allies: InteractiveSprite[] = [];
    private enemies: InteractiveSprite[] = [];

    constructor() {
        super({ key: 'BattleScene' });
    }

    preload() {
        const mapLevel = WorldManager.getCurrentMap();
        this.load.image('battle-bg', `./images/battle-${mapLevel}.png`);
        this.load.audio('battle-bg-music', `./music/battle-${mapLevel}.mp3`);

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
        this.backgroundMusic = this.sound.add('battle-bg-music', { volume: 0.5, loop: true });
        this.backgroundMusic.play();
        this.tweens.add({
            targets: this.backgroundMusic,
            volume: 0.5,
            duration: 1000,
        });

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
            this.startWorldScene();
        }
    }

    startWorldScene() {
        this.tweens.add({
            targets: this.backgroundMusic,
            volume: 0,
            duration: 1000,
            destroy: false,
            pause: true,
            onComplete: () => {
                // this.backgroundMusic?.stop();
                this.scene.start('WorldScene');
            },
        });
    }
}
