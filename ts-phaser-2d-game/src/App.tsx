import { useEffect, useState } from 'react';
import { WorldScene } from './world/WorldScene';
import { BattleComponent } from './battle/BattleComponent';
import { QuestStatus } from './quests/types';
import { QuestComponent } from './quests/QuestComponent';
import { WorldManager } from './world/WorldManager';
import { TileBossData } from './world/types';
import { PartyComponent } from './party/PartyComponent';
import { InventoryComponent } from './items/InventoryComponent';

export const App = () => {
    const [worldScene, setWorldScene] = useState<WorldScene | undefined>();
    const [inBattle, setInBattle] = useState(false);
    const [bossBattleData, setBossBattleData] = useState<TileBossData | undefined>();
    const [inQuest, setInQuest] = useState<QuestStatus | undefined>();
    const [inParty, setInParty] = useState(false);
    const [inInventory, setInInventory] = useState(false);

    useEffect(() => {
        const scene = new WorldScene({
            onStartBattle: ({ bossData }) => {
                setInBattle(true);
                setBossBattleData(bossData);
            },
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
        <>
            <main className="gameWrapper">
                <h2>Headwind</h2>
                <div id="sceneWrapper" className={inBattle || inParty || inInventory ? 'hidden' : ''}>
                    {inQuest && (
                        <QuestComponent
                            onUpdateMap={() => {
                                worldScene?.drawTiles({ tiles: WorldManager.getCurrentMap().tiles });
                            }}
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
                        bossData={bossBattleData}
                        onEndBattle={() => {
                            setInBattle(false);
                            worldScene?.endBattle();
                        }}
                    />
                )}
                {inParty && !inBattle && <PartyComponent />}
                {inInventory && !inBattle && <InventoryComponent />}
            </main>
            <nav className="navWrapper">
                <div
                    onClick={() => {
                        setInParty(false);
                        setInInventory(false);
                    }}
                    className="navItem"
                >
                    World
                </div>
                <div onClick={() => setInParty(!inParty)} className="navItem">
                    Party
                </div>
                <div onClick={() => setInInventory(!inInventory)} className="navItem">
                    Inventory
                </div>
                <div onClick={() => console.log('TODO - inventory')} className="navItem">
                    Account
                </div>
            </nav>
        </>
    );
};
