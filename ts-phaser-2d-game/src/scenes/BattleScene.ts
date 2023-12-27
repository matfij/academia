import { Scene } from 'phaser';
import { PartyManager } from '../state/PartyManager';
import { EncounterManager, MapLevel } from '../state/EncounterManager';
import { WorldManager } from '../state/WorldManager';
import { BattleAlly, BattleEnemy, InteractiveSprite, Point } from '../shared/types';
import { BattleManager } from '../state/BattleManager';

export class BattleScene extends Scene {
    private backgroundMusic?: Phaser.Sound.BaseSound = undefined;
    private allies: BattleAlly[] = [];
    private enemies: BattleEnemy[] = [];
    private selectedAlly?: BattleAlly = undefined;

    constructor() {
        super({ key: 'BattleScene' });
    }

    preload() {
        const mapLevel = WorldManager.getCurrentMap();
        this.load.image('battle-bg', `./images/battle-${mapLevel}.png`);
        this.load.audio('battle-bg-music', `./music/battle-${mapLevel}.mp3`);

        this.load.image('attack-frame', `./images/attack-frame-icon.png`);
        this.load.image('attack-action', `./images/attack-action-icon.png`);

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
        BattleManager.startBattle({ allies: this.allies, enemies: this.enemies });
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
        this.add
            .image(400, 200, 'battle-bg')
            .setInteractive()
            .on('pointerdown', () => this.onAllySelected(undefined));
        this.add
            .image(750, 350, 'attack-action')
            .setInteractive()
            .on('pointerdown', () => this.executeTurn());
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
            const newEnemy: BattleEnemy = {
                ...enemy,
                alive: true,
                sprite: this.physics.add.sprite(700 - xOffset, 100 + yOffset, enemy.id).setInteractive(),
            };
            newEnemy.sprite.on('pointerdown', () => this.onEnemySelected(newEnemy.id));
            this.enemies.push(newEnemy);
            xOffset += 50;
            yOffset += 100;
        });
    }

    private createParty() {
        let xOffset = 0;
        let yOffset = 0;
        PartyManager.getParty().forEach((ally) => {
            const MOVE_POSITIONS: Point[] = [
                { x: 320, y: 320 },
                { x: 450, y: 320 },
                { x: 320, y: 360 },
                { x: 450, y: 360 },
            ];
            const moveImages: InteractiveSprite[] = [];
            const moveLabels: Phaser.GameObjects.Text[] = [];
            ally.moves.forEach((move, moveIndex) => {
                console.log(move, moveIndex, MOVE_POSITIONS[moveIndex].y);
                const moveImage = this.physics.add
                    .image(MOVE_POSITIONS[moveIndex].x, MOVE_POSITIONS[moveIndex].y, 'attack-frame')
                    .setInteractive()
                    .on('pointerdown', () => this.onMoveSelected(move.id));
                const moveLabel = this.add
                    .text(MOVE_POSITIONS[moveIndex].x - 45, MOVE_POSITIONS[moveIndex].y - 8, move.name)
                    .setFont('13px Arial')
                    .setColor('#ffffff');
                const moveTexture = this.add.renderTexture(
                    MOVE_POSITIONS[moveIndex].x,
                    MOVE_POSITIONS[moveIndex].y,
                );
                moveTexture.draw(moveLabel);
                moveTexture.saveTexture(`attack-texture-${move.name}`);
                moveImages.push(moveImage);
                moveLabels.push(moveLabel);
            });
            const moveMenuContainer = this.add.container(0, 0, [...moveImages, ...moveLabels]);
            moveMenuContainer.setVisible(false);
            const newAlly: BattleAlly = {
                ...ally,
                sprite: this.physics.add.image(100 + xOffset, 100 + yOffset, ally.id).setInteractive(),
                selectedMoveId: ally.moves[0].id,
                selectedTargetId: this.enemies[0].id,
                moveMenu: {
                    moveA: moveImages[0],
                    moveB: moveImages[1],
                    moveC: moveImages[2],
                    moveD: moveImages[3],
                    container: moveMenuContainer,
                },
                alive: true,
            };
            newAlly.sprite.on('pointerdown', () => this.onAllySelected(newAlly.id));
            this.allies.push(newAlly);
            xOffset += 50;
            yOffset += 100;
        });
    }

    private onAllySelected(allyId: string | undefined) {
        this.allies.forEach((ally) => {
            if (allyId === ally.id) {
                this.selectedAlly = ally;
                ally.moveMenu.container.setVisible(true);
            } else {
                ally.moveMenu.container.setVisible(false);
            }
        });
    }

    private onMoveSelected(moveId: string) {
        if (!this.selectedAlly) {
            return;
        }
        this.selectedAlly.selectedMoveId = moveId;
    }

    private onEnemySelected(enemyId: string) {
        if (!this.selectedAlly) {
            return;
        }
        this.selectedAlly.selectedTargetId = enemyId;
    }

    private executeTurn() {
        this.onAllySelected(undefined);
        BattleManager.executeTurn({ battleAllies: this.allies });
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
