import style from './BattleComponent.module.scss';
import { useEffect, useState } from 'react';
import { BattleAlly, BattleEnemy, BattleMove, BattleResult, TurnStatus } from '../shared/types';
import { PartyManager } from '../state/PartyManager';
import { WorldManager } from '../world/WorldManager';
import { EncounterManager, MapLevel } from '../world/EncounterManager';
import { BattleManager } from './BattleManager';
import { uuid } from '../shared/utils';

type BattleComponentProps = {
    onEndBattle: () => void;
};

export const BattleComponent = ({ onEndBattle }: BattleComponentProps) => {
    const [mapLevel, setMapLevel] = useState<MapLevel>(MapLevel.MapLevel1);
    const [battleAllies, setBattleAllies] = useState<BattleAlly[]>([]);
    const [battleEnemies, setBattleEnemies] = useState<BattleEnemy[]>([]);
    const [turnStatus, setTurnStatus] = useState<TurnStatus>();
    const [selectedAlly, setSelectedAlly] = useState<BattleAlly>();
    const [turnAnimating, setTurnAnimating] = useState(false);
    const [battleResult, setBattleResult] = useState<BattleResult | undefined>();

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
        if (!ally.alive || turnAnimating) {
            return;
        }
        setSelectedAlly(ally);
    };

    const onMoveSelection = (move: BattleMove) => {
        if (!selectedAlly || turnAnimating) {
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
        if (!selectedAlly || !target || turnAnimating) {
            return;
        }
        selectedAlly.selectedTargetId = targetId;
        battleAllies.find((a) => a.id === selectedAlly.id)!.selectedTargetId = targetId;
        setSelectedAlly({ ...selectedAlly });
    };

    const onAttack = () => {
        if (turnAnimating) {
            return;
        }
        const actions: {
            allyId: string;
            moveId: string;
            targetId: string;
        }[] = battleAllies.map((a) => ({
            allyId: a.id,
            moveId: a.selectedMove.id,
            targetId: a.selectedTargetId,
        }));
        const { allies, enemies, turnResults, battleResult } = BattleManager.executeTurn({ actions });

        const aliveAllies = battleAllies.filter((a) => a.alive);
        const newSelectedAlly = aliveAllies.length > 0 ? aliveAllies[0] : null;
        if (newSelectedAlly) {
            setSelectedAlly(newSelectedAlly);
        }
        aliveAllies.forEach((ally) => {
            const oldSelection = [...allies, ...enemies].find((e) => e.id === ally.selectedTargetId);
            if (!oldSelection || !oldSelection.alive) {
                const aliveEnemies = battleEnemies.filter((e) => e.alive);
                const newSelection = aliveEnemies.length > 0 ? aliveEnemies[0] : null;
                if (newSelection) {
                    ally.selectedTargetId = newSelection.id;
                }
            }
        });

        let statusDelay = 0;
        const delayIncrement = 1500;
        setTurnAnimating(true);
        setTurnStatus(undefined);
        turnResults.forEach((result) => {
            setTimeout(() => {
                const character = [...allies, ...enemies].find((c) => c.id === result.userId);
                const target = [...allies, ...enemies].find((c) => c.id === result.targetId);
                if (!character || !target) {
                    return;
                }
                setTurnStatus({
                    userId: result.userId,
                    targetId: target.id,
                    moveUsed: result.moveName,
                    damageReceived: result.moveValue,
                });
            }, statusDelay);

            statusDelay += delayIncrement;
        });
        setTimeout(() => {
            setTurnStatus(undefined);
            setTurnAnimating(false);
            setBattleResult(battleResult);
        }, statusDelay);

        setBattleAllies(allies as BattleAlly[]);
        setBattleEnemies(enemies);
    };

    const getMoveUsed = (characterId: string) => {
        if (turnStatus?.userId === characterId) {
            return turnStatus.moveUsed;
        }
    };

    const getDamageReceived = (characterId: string) => {
        if (turnStatus?.targetId === characterId) {
            return turnStatus.damageReceived.toFixed(1);
        }
    };

    return (
        <main>
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
                                {getMoveUsed(ally.id) && (
                                    <div key={uuid()} className={style.statusMoveItem}>
                                        {getMoveUsed(ally.id)}
                                    </div>
                                )}
                                {getDamageReceived(ally.id) && (
                                    <div key={uuid()} className={style.statusDamageItem}>
                                        {getDamageReceived(ally.id)}
                                    </div>
                                )}
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
                                {getMoveUsed(enemy.id) && (
                                    <div key={uuid()} className={style.statusMoveItem}>
                                        {getMoveUsed(enemy.id)}
                                    </div>
                                )}
                                {getDamageReceived(enemy.id) && (
                                    <div key={uuid()} className={style.statusDamageItem}>
                                        {getDamageReceived(enemy.id)}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                <div className={turnAnimating ? style.buttonsWrapperDisabled : style.actionsWrapper}>
                    <div className={style.movesWrapper}>
                        {selectedAlly &&
                            selectedAlly.moves.map((move) => (
                                <button
                                    onClick={() => onMoveSelection(move)}
                                    key={move.id}
                                    className={`${style.moveItem} ${
                                        move.id === selectedAlly?.selectedMove.id
                                            ? style.selectedMoveItem
                                            : ''
                                    }`}
                                >
                                    <p>{move.name}</p>
                                </button>
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
            {battleResult && (
                <section className={style.battleOverlay}>
                    {battleResult.victory ? (
                        <>
                            <p className={style.resultLabel}>
                                {battleResult.victory ? 'Victory' : 'Defeated'}
                            </p>
                            <hr />
                            <p className={style.lootLabel}>Experience: {battleResult.experience}</p>
                            <p className={style.lootLabel}>Gold: {battleResult.gold}</p>
                        </>
                    ) : (
                        <>
                            <p className={style.resultLabel}>Defeat</p>
                            <hr />
                        </>
                    )}
                    <div onClick={() => onEndBattle()} className={style.finishButton}>
                        Close
                    </div>
                </section>
            )}
        </main>
    );
};
