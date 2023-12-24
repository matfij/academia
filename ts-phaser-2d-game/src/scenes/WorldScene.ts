import { Scene } from 'phaser';

export class WorldScene extends Scene {
    private player?: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

    constructor() {
        super();
    }

    preload() {
        this.load.image('world', './images/map.png');
        this.load.image('player', './images/player.png');
    }

    create() {
        this.createMap();
        this.createPlayer();
    }

    update(): void {
        if (!this.player || !this.input.keyboard) {
            return;
        }
        const cursors = this.input.keyboard.createCursorKeys();
        if (cursors.left.isDown) {
            console.log('left');
            this.player.setPosition(this.player.x - 1, this.player.y);
        } else if (cursors.right.isDown) {
            console.log('right');
            this.player.setPosition(this.player.x + 1, this.player.y);
        } else if (cursors.up.isDown) {
            console.log('up');
            this.player.setPosition(this.player.x, this.player.y - 1);
        } else if (cursors.down.isDown) {
            console.log('down');
            this.player.setPosition(this.player.x, this.player.y + 1);
        }
    }

    private createMap() {
        this.add.image(0, 0, 'world');
    }

    private createPlayer() {
        this.player = this.physics.add.sprite(100, 100, 'player');
    }
}
