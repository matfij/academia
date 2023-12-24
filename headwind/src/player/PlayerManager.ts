import { Assets, Sprite } from 'pixi.js';
import { WorldManager } from '../world/WorldManager';

export class PlayerManager {
    private static readonly TEXTURE_PATH = './images/player.png';
    private static readonly MOVE_SPEED = 10;
    private static player: Sprite;

    public static async loadPlayer({ x, y }: { x: number; y: number }) {
        if (this.player) {
            return;
        }
        console.log('strat')
        const texture = await Assets.load(this.TEXTURE_PATH);
        this.player = new Sprite(texture);
        this.player.x = x;
        this.player.y = y;
        WorldManager.getApp().stage.addChild(this.player);
        window.addEventListener('keydown', this.handleMovement);
        this.handleMovement = this.handleMovement.bind(this);
    }

    private static handleMovement(event: KeyboardEvent) {
        if (!this.player) {
            return;
        }
        switch (event.key) {
            case 'ArrowLeft': {
                this.player.x -= this.MOVE_SPEED;
                break;
            }
            case 'ArrowRight': {
                this.player.x += this.MOVE_SPEED;
                break;
            }
            case 'ArrowUp': {
                this.player.y -= this.MOVE_SPEED;
                break;
            }
            case 'ArrowDown': {
                this.player.y += this.MOVE_SPEED;
                break;
            }
        }
    }
}
