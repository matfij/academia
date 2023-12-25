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

    update() {
        if (!this.player || !this.input.keyboard) {
            return;
        }
        const cursors = this.input.keyboard.createCursorKeys();
        const speed = 200;
        this.player.setVelocity(0, 0);
        console.log(this.player.x, this.player.y);

        if (cursors.left.isDown) {
            this.player.setVelocityX(-speed);
        } else if (cursors.right.isDown) {
            this.player.setVelocityX(speed);
        }
        if (cursors.up.isDown) {
            this.player.setVelocityY(-speed);
        } else if (cursors.down.isDown) {
            this.player.setVelocityY(speed);
        }
    }

    private createMap() {
        this.add.image(400, 200, 'world');
    }

    private createPlayer() {
        if (this.player) {
            return;
        }
        this.player = this.physics.add.sprite(100, 100, 'player');
    }
}
