import { useEffect } from 'react';
import Phaser from 'phaser';
import { WorldScene } from './scenes/WorldScene';
import { BattleScene } from './scenes/BattleScene';

export const App = () => {
    useEffect(() => {
        const config: Phaser.Types.Core.GameConfig = {
            width: 800,
            height: 400,
            scene: [WorldScene, BattleScene],
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { x: 0, y: 0 },
                    debug: true,
                },
            },
            parent: 'sceneWrapper',
        };
        const game = new Phaser.Game(config);
        return () => {
            game.destroy(true);
        };
    }, []);

    return (
        <main className="gameWrapper">
            <h2>Headwind</h2>
            <div id="sceneWrapper"></div>
        </main>
    );
};
