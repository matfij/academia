import style from './BattleComponent.module.scss';
import { useEffect, useState } from 'react';
import { BattleAlly, BattleEnemy, BattleMove } from '../shared/types';
import { PartyManager } from '../state/PartyManager';
import { WorldManager } from '../world/WorldManager';
import { EncounterManager, MapLevel } from '../world/EncounterManager';
import { BattleManager } from './BattleManager';

type BattleComponentProps = {
    onEndBattle: () => void;
};

export const BattleComponent = ({ onEndBattle }: BattleComponentProps) => {
    const [mapLevel, setMapLevel] = useState<MapLevel>(MapLevel.MapLevel1);
    const [battleAllies, setBattleAllies] = useState<BattleAlly[]>([]);
    const [battleEnemies, setBattleEnemies] = useState<BattleEnemy[]>([]);
    const [selectedAlly, setSelectedAlly] = useState<BattleAlly>();

    useEffect(() => {
        setMapLevel(WorldManager.getCurrentMap());
        const enemies: BattleEnemy[] = EncounterManager.getEncounter({ mapLevel }).enemies.map((enemy) => ({
            ...enemy,
            alive: true,
            imageUrl: `./images/${enemy.id}.png`,
            battleStatistics: BattleManager.getBattleStatistics({ character: enemy }),
        }));
        setBattleEnemies(enemies);
        const allies: BattleAlly[] = PartyManager.getParty().map((ally) => ({
            ...ally,
            alive: true,
            selectedMove: ally.moves[0],
            selectedTargetId: enemies[0].id,
            imageUrl: `./images/${ally.id}.png`,
            battleStatistics: BattleManager.getBattleStatistics({ character: ally }),
        }));
        setBattleAllies(allies);
        setSelectedAlly(allies[0]);
        BattleManager.startBattle({ allies, enemies });
    }, [mapLevel]);

    const onAllySelection = (ally: BattleAlly) => {
        if (!ally.alive) {
            return;
        }
        setSelectedAlly(ally);
    };

    const onMoveSelection = (move: BattleMove) => {
        if (!selectedAlly) {
            return;
        }
        selectedAlly.selectedMove = move;
        battleAllies.find((a) => a.id === selectedAlly.id)!.selectedMove = move;
        setSelectedAlly({ ...selectedAlly });
    };

    const onTargetSelection = (targetId: string) => {
        const target = [...battleAllies, ...battleEnemies]
            .filter((c) => c.alive)
            .find((c) => c.id === targetId);
        if (!selectedAlly || !target) {
            return;
        }
        selectedAlly.selectedTargetId = targetId;
        battleAllies.find((a) => a.id === selectedAlly.id)!.selectedTargetId = targetId;
        setSelectedAlly({ ...selectedAlly });
    };

    const onAttack = () => {
        const actions: {
            allyId: string;
            moveId: string;
            targetId: string;
        }[] = battleAllies.map((a) => ({
            allyId: a.id,
            moveId: a.selectedMove.id,
            targetId: a.selectedTargetId,
        }));
        const { allies, enemies, turnResults } = BattleManager.executeTurn({ actions });

        const aliveAllies = battleAllies.filter((a) => a.alive);
        const newSelectedAlly = aliveAllies.length > 0 ? aliveAllies[0] : null;
        if (newSelectedAlly) {
            setSelectedAlly(newSelectedAlly);
        }

        aliveAllies.forEach((ally) => {
            const aliveEnemies = battleEnemies.filter((e) => e.alive);
            const newSelectedEnemy = aliveEnemies.length > 0 ? aliveEnemies[0] : null;
            if (newSelectedEnemy) {
                ally.selectedTargetId = newSelectedEnemy.id;
            }
        });

        turnResults.forEach((result) => {
            console.log(`${result.byAlly} | ${result.userId}`);
        });

        setBattleAllies(allies as BattleAlly[]);
        setBattleEnemies(enemies);
    };

    return (
        <section
            className={style.battleWrapper}
            style={{ backgroundImage: `url(./images/battle-${mapLevel}.png)` }}
        >
            <div className={style.charactersWrapper}>
                <div className={style.alliesWrapper}>
                    {battleAllies.map((ally) => (
                        <div
                            onClick={() => onAllySelection(ally)}
                            key={ally.id}
                            className={`${style.characterItem}
                                ${ally.id === selectedAlly?.id ? style.selectedCharacterItem : ''}
                                ${!ally.alive ? style.deadCharacterItem : ''}`}
                        >
                            <p>{ally.name}</p>
                            <img src={ally.imageUrl} alt={ally.name} />
                            <progress
                                max={ally.battleStatistics.maxHealth}
                                value={ally.battleStatistics.health}
                            />
                        </div>
                    ))}
                </div>
                <div className={style.enemiesWrapper}>
                    {battleEnemies.map((enemy) => (
                        <div
                            onClick={() => onTargetSelection(enemy.id)}
                            key={enemy.id}
                            className={`${style.characterItem}
                                ${
                                    enemy.id === selectedAlly?.selectedTargetId
                                        ? style.targetCharacterItem
                                        : ''
                                }
                                ${!enemy.alive ? style.deadCharacterItem : ''}
                            `}
                        >
                            <p>{enemy.name}</p>
                            <img src={enemy.imageUrl} alt={enemy.name} />
                            <progress
                                max={enemy.battleStatistics.maxHealth}
                                value={enemy.battleStatistics.health}
                            />
                        </div>
                    ))}
                </div>
            </div>
            <div className={style.actionsWrapper}>
                <div className={style.movesWrapper}>
                    {selectedAlly &&
                        selectedAlly.moves.map((move) => (
                            <div
                                onClick={() => onMoveSelection(move)}
                                key={move.id}
                                className={`${style.moveItem} ${
                                    move.id === selectedAlly?.selectedMove.id ? style.selectedMoveItem : ''
                                }`}
                            >
                                <p>{move.name}</p>
                            </div>
                        ))}
                </div>
                <div className={style.buttonsWrapper}>
                    <button onClick={() => onAttack()} className={style.actionButton}>
                        Attack
                    </button>
                    <button onClick={() => onEndBattle()} className={style.actionButton}>
                        Run
                    </button>
                </div>
            </div>
        </section>
    );
};