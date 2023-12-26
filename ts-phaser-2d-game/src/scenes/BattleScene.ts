import { Scene } from 'phaser';
import { PartyManager } from '../state/PartyManager';
import { EncounterManager, MapLevel } from '../state/EncounterManager';
import { WorldManager } from '../state/WorldManager';
import { BattleAlly, BattleEnemy, InteractiveSprite, Point } from '../shared/types';

export class BattleScene extends Scene {
    private backgroundMusic?: Phaser.Sound.BaseSound = undefined;
    private allies: BattleAlly[] = [];
    private enemies: BattleEnemy[] = [];
    private attackMenu?: Phaser.GameObjects.Container = undefined;
    private selectedAlly?: BattleAlly = undefined;

    constructor() {
        super({ key: 'BattleScene' });
    }

    preload() {
        const mapLevel = WorldManager.getCurrentMap();
        this.load.image('battle-bg', `./images/battle-${mapLevel}.png`);
        this.load.audio('battle-bg-music', `./music/battle-${mapLevel}.mp3`);

        this.load.image('attack-frame', `./images/attack-frame-icon.png`);

        EncounterManager.getEncounter({ mapLevel }).enemies.forEach((enemy) => {
            this.load.image(enemy.id, `./images/${enemy.id}.png`);
        });

        PartyManager.getParty().forEach((player) => {
            this.load.image(player.id, `./images/${player.id}.png`);
        });
    }

    create() {
        const mapLevel = WorldManager.getCurrentMap();
        this.createBackground();
        this.createEnemies(mapLevel);
        this.createParty();
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

    private createBackground() {
        this.add.image(400, 200, 'battle-bg');
        this.backgroundMusic = this.sound.add('battle-bg-music', { volume: 0.5, loop: true });
        this.backgroundMusic.play();
        this.tweens.add({
            targets: this.backgroundMusic,
            volume: 0.5,
            duration: 1000,
        });
    }

    private createEnemies(mapLevel: MapLevel) {
        let xOffset = 0;
        let yOffset = 0;
        EncounterManager.getEncounter({ mapLevel }).enemies.forEach((enemy) => {
            this.enemies.push({
                ...enemy,
                sprite: this.physics.add.sprite(700 - xOffset, 100 + yOffset, enemy.id).setInteractive(),
            });
            xOffset += 50;
            yOffset += 100;
        });
    }

    private createParty() {
        let xOffset = 0;
        let yOffset = 0;
        PartyManager.getParty().forEach((ally) => {
            const ATTACK_POSITIONS: Point[] = [
                { x: 320, y: 320 },
                { x: 450, y: 320 },
                { x: 320, y: 360 },
                { x: 450, y: 360 },
            ];
            const attackImages: InteractiveSprite[] = [];
            const attackLabels: Phaser.GameObjects.Text[] = [];
            ally.attacks.forEach((attack, attackIndex) => {
                console.log(attack, attackIndex, ATTACK_POSITIONS[attackIndex].y);
                const attackImage = this.physics.add
                    .image(ATTACK_POSITIONS[attackIndex].x, ATTACK_POSITIONS[attackIndex].y, 'attack-frame')
                    .setInteractive();
                const attackName = this.add
                    .text(ATTACK_POSITIONS[attackIndex].x - 45, ATTACK_POSITIONS[attackIndex].y - 8, attack.name)
                    .setFont('13px Arial')
                    .setColor('#ffffff');
                const renderTexture = this.add.renderTexture(
                    ATTACK_POSITIONS[attackIndex].x,
                    ATTACK_POSITIONS[attackIndex].y,
                );
                renderTexture.draw(attackName);
                renderTexture.saveTexture(`attack-texture-${attack.name}`);

                attackImages.push(attackImage);
                attackLabels.push(attackName);
            });

            const attackMenuContainer = this.add.container(0, 0, [...attackImages, ...attackLabels]);
            attackMenuContainer.setVisible(false);

            const newAlly: BattleAlly = {
                ...ally,
                sprite: this.physics.add.image(100 + xOffset, 100 + yOffset, ally.id).setInteractive(),
                selectedEnemyId: this.enemies[0].id,
                attackMenu: {
                    container: attackMenuContainer,
                    attackA: attackImages[0],
                    attackB: attackImages[1],
                    attackC: attackImages[2],
                    attackD: attackImages[3],
                    selectedAttackIndex: 0,
                },
            };
            newAlly.sprite.on('pointerdown', () => this.onAllySelected(newAlly.id));
            this.allies.push(newAlly);
            xOffset += 50;
            yOffset += 100;
        });
    }

    private onAllySelected(allyId: BattleAlly) {
        this.allies.forEach((ally) => {
            if (allyId === ally.id) {
                ally.attackMenu.container.setVisible(true);
            } else {
                ally.attackMenu.container.setVisible(false);
            }
        });
    }

    private startWorldScene() {
        this.tweens.add({
            targets: this.backgroundMusic,
            volume: 0,
            duration: 1000,
            destroy: false,
            pause: true,
            onComplete: () => {
                this.scene.start('WorldScene');
            },
        });
    }
}
