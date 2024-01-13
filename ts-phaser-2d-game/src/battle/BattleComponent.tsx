import style from './BattleComponent.module.scss';
import { useEffect, useState } from 'react';
import { PartyManager } from '../party/PartyManager';
import { WorldManager } from '../world/WorldManager';
import { EncounterManager } from '../world/EncounterManager';
import { BattleManager } from './BattleManager';
import { uuid } from '../.shared/utils';
import { AdventureMap, TileBossData } from '../world/types';
import { ALL_MAPS } from '../world/all-maps';
import { BattleAction, BattleResult, DisplayAlly, DisplayEnemy, TurnStatus } from './types';
import { BattleMove } from '../moves/types';
import { BattleEnemy } from '../enemies/types';
import { BattleAlly } from '../party/types';
import { TooltipComponent } from '../.shared/TooltipComponent';

type BattleComponentProps = {
    bossData?: TileBossData;
    onEndBattle: () => void;
};

export const BattleComponent = ({ bossData, onEndBattle }: BattleComponentProps) => {
    const [adventureMap, setAdventureMap] = useState<AdventureMap>(ALL_MAPS[0]);
    const [displayAllies, setDisplayAllies] = useState<DisplayAlly[]>([]);
    const [displayEnemies, setDisplayEnemies] = useState<DisplayEnemy[]>([]);
    const [turnStatus, setTurnStatus] = useState<TurnStatus>();
    const [selectedAlly, setSelectedAlly] = useState<DisplayAlly>();
    const [turnAnimating, setTurnAnimating] = useState(false);
    const [battleResult, setBattleResult] = useState<BattleResult | undefined>();

    useEffect(() => {
        setAdventureMap(WorldManager.getCurrentMap());
        const battleAllies = PartyManager.getBattleParty();
        const battleEnemies = bossData
            ? EncounterManager.getBossEncounter({ bossUid: bossData.bossUid })
            : EncounterManager.getEncounter({ map: WorldManager.getCurrentMap() });
        const displayEnemies = mapToDisplayEnemies({
            enemies: battleEnemies,
        });
        const displayAllies: DisplayAlly[] = mapToDisplayAllies({
            allies: battleAllies,
            enemies: battleEnemies,
        });
        setDisplayEnemies(displayEnemies);
        setDisplayAllies(displayAllies);
        setSelectedAlly(displayAllies[0]);
        BattleManager.startBattle({ allies: displayAllies, enemies: displayEnemies });
    }, []);

    const onAllySelection = (ally: DisplayAlly) => {
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
        displayAllies.find((a) => a.id === selectedAlly.id)!.selectedMove = move;
        setSelectedAlly({ ...selectedAlly });
    };

    const onTargetSelection = (targetId: string) => {
        const target = [...displayAllies, ...displayEnemies]
            .filter((c) => c.alive)
            .find((c) => c.id === targetId);
        if (!selectedAlly || !target || turnAnimating) {
            return;
        }
        selectedAlly.selectedTargetId = targetId;
        displayAllies.find((a) => a.id === selectedAlly.id)!.selectedTargetId = targetId;
        setSelectedAlly({ ...selectedAlly });
    };

    const onAttack = () => {
        if (turnAnimating) {
            return;
        }

        // calculating turn resutls
        const actions: BattleAction[] = displayAllies.map((ally) => ({
            allyId: ally.id,
            moveUid: ally.selectedMove.uid,
            targetId: ally.selectedTargetId,
        }));
        const { allies, enemies, turnResults, battleResult } = BattleManager.executeTurn({ actions });

        // re-selecting targets
        const aliveAllies = displayAllies.filter((a) => a.alive);
        const newSelectedAlly = aliveAllies.length > 0 ? aliveAllies[0] : null;
        if (newSelectedAlly) {
            setSelectedAlly(newSelectedAlly);
        }
        aliveAllies.forEach((ally) => {
            const oldSelection = [...allies, ...enemies].find((e) => e.id === ally.selectedTargetId);
            if (!oldSelection || !oldSelection.alive) {
                const aliveEnemies = displayEnemies.filter((e) => e.alive);
                const newSelection = aliveEnemies.length > 0 ? aliveEnemies[0] : null;
                if (newSelection) {
                    ally.selectedTargetId = newSelection.id;
                }
            }
        });

        // animating moves
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

        // TODO - update state while animating turnStatus
        // setDisplayAllies(mapToDisplayAllies({ allies, enemies }));
        // setDisplayEnemies(mapToDisplayEnemies({ enemies }));
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

    const mapToDisplayEnemies = ({ enemies }: { enemies: BattleEnemy[] }) => {
        return enemies.map((enemy) => ({
            ...enemy,
            alive: true,
            imageUrl: `./images/${enemy.uid}.png`,
        }));
    };

    const mapToDisplayAllies = ({ allies, enemies }: { allies: BattleAlly[]; enemies: BattleEnemy[] }) => {
        return allies.map((ally) => ({
            ...ally,
            alive: true,
            selectedMove: ally.moves[0],
            selectedTargetId: enemies[0].id,
            imageUrl: `./images/${ally.uid}.png`,
        }));
    };

    const getMoveDescription = (move: BattleMove) => {
        return (
            <>
                <h2>{move.name}</h2>
                <p>Damage: {move.damage}</p>
            </>
        );
    };

    return (
        <main>
            <section
                className={style.battleWrapper}
                style={{
                    backgroundImage: bossData
                        ? `url(./images/${bossData.backgroundPath})`
                        : `url(./images/battle-${adventureMap.uid}.png)`,
                }}
            >
                <div className={style.charactersWrapper}>
                    <div className={style.alliesWrapper}>
                        {displayAllies.map((ally) => (
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
                        {displayEnemies.map((enemy) => (
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
                                <TooltipComponent
                                    key={move.uid}
                                    content={
                                        <button
                                            onClick={() => onMoveSelection(move)}
                                            className={`${style.moveItem} ${
                                                move.uid === selectedAlly?.selectedMove.uid
                                                    ? style.selectedMoveItem
                                                    : ''
                                            }`}
                                        >
                                            <p>{move.name}</p>
                                        </button>
                                    }
                                    hint={getMoveDescription(move)}
                                    config={{ containerWidth: '100%' }}
                                />
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
                            {battleResult.loots.length && (
                                <p className={style.lootLabel} style={{ marginTop: '10px' }}>
                                    Obtained items:
                                </p>
                            )}
                            {battleResult.loots.map((loot, lootIndex) => (
                                <li key={lootIndex} className={style.lootLabelSmall}>
                                    {loot.itemName}
                                </li>
                            ))}
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
