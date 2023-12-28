import { useEffect, useState } from 'react';
import Phaser from 'phaser';
import { WorldScene } from './scenes/WorldScene';
import { BattleComponent } from './battle/BattleComponent';

export const App = () => {
    const [worldScene, setWorldScene] = useState<WorldScene | undefined>();
    const [inBattle, setInBattle] = useState(false);

    useEffect(() => {
        const scene = new WorldScene({ onStartBattle: () => setInBattle(true) });
        const game = new Phaser.Game({
            width: 800,
            height: 400,
            scene: scene,
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { x: 0, y: 0 },
                    debug: true,
                },
            },
            parent: 'sceneWrapper',
        });
        setWorldScene(scene);
        return () => {
            game.destroy(true);
        };
    }, []);

    return (
        <main className="gameWrapper">
            <h2>Headwind</h2>
            <div id="sceneWrapper" className={inBattle ? 'hidden' : ''}></div>
            {inBattle && (
                <BattleComponent
                    onEndBattle={() => {
                        setInBattle(false);
                        worldScene?.endBattle();
                    }}
                />
            )}
        </main>
    );
};
