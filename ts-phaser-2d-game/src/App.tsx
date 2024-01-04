import { useEffect, useState } from 'react';
import Phaser from 'phaser';
import { WorldScene } from './world/WorldScene';
import { BattleComponent } from './battle/BattleComponent';
import { QuestStatus } from './quests/types';
import { QuestComponent } from './quests/QuestComponent';

export const App = () => {
    const [worldScene, setWorldScene] = useState<WorldScene | undefined>();
    const [inBattle, setInBattle] = useState(false);
    const [inQuest, setInQuest] = useState<QuestStatus | undefined>();

    useEffect(() => {
        const scene = new WorldScene({
            onStartBattle: () => setInBattle(true),
            onShowQuest: (questDescription) => setInQuest(questDescription),
        });
        const game = new Phaser.Game({
            width: 1100,
            height: 600,
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
            <div id="sceneWrapper" className={inBattle ? 'hidden' : ''}>
                {inQuest && (
                    <QuestComponent
                        onHideQuest={() => {
                            setInQuest(undefined);
                            worldScene?.hideQuest();
                        }}
                        questUid={inQuest.uid}
                        questDescription={inQuest.description}
                        questState={inQuest.state}
                    />
                )}
            </div>
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
