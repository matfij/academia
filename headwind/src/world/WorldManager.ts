import { Application, Assets, Sprite } from 'pixi.js';

export class WorldManager {
    private static app: Application;

    public static createApp({ canvas }: { canvas: HTMLCanvasElement | undefined } = { canvas: undefined }) {
        this.app = new Application({
            view: canvas,
            width: 800,
            height: 400,
        });
        document.body.appendChild(this.app.view as unknown as Node);
    }

    public static getApp() {
        if (this.app) {
            return this.app;
        } else {
            this.createApp();
            return this.app;
        }
    }

    public static async loadWorldMap({ texturePath }: { texturePath: string }) {
        const worldTexture = await Assets.load(texturePath);
        const world = new Sprite(worldTexture);
        world.x = 0;
        world.y = 0;
        this.getApp().stage.addChild(world);
    }
}
