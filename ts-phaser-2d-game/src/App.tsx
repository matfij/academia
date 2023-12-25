import { useEffect } from 'react';
import Phaser from 'phaser';
import { WorldScene } from './scenes/WorldScene';

export const App = () => {
    useEffect(() => {
        const config: Phaser.Types.Core.GameConfig = {
            width: 800,
            height: 400,
            scene: WorldScene,
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { x: 0, y: 0 },
                    debug: true,
                },
            },
            parent: 'phaser-container',
        };
        const game = new Phaser.Game(config);
        return () => {
            game.destroy(true);
        };
    }, []);

    return (
        <>
            <h2>Headwind</h2>
            <div id="phaser-container"></div>
        </>
    );
};
