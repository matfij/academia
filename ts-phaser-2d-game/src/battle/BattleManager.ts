import { BattleEnemy } from '../enemies/types';
import { BattleMove } from '../moves/types';
import { BattleAlly } from '../party/types';
import { QuestManager } from '../quests/QuestManager';
import { getMoveValueSpread, getRandomItem } from '../.shared/math';
import { BattleResultsManager } from './BattleResultsManager';
import { BattleAction } from './types';

export class BattleManager {
    private static turnNumber = 0;
    private static allies: BattleAlly[] = [];
    private static enemies: BattleEnemy[] = [];

    public static startBattle({ allies, enemies }: { allies: BattleAlly[]; enemies: BattleEnemy[] }) {
        this.turnNumber = 0;
        this.allies = allies;
        this.enemies = enemies;
    }

    public static executeTurn({ actions }: { actions: BattleAction[] }) {
        const turnResults: {
            byAlly: boolean;
            userId: string;
            targetId: string;
            moveName: string;
            moveValue: number;
        }[] = [];
        [...this.allies, ...this.enemies]
            .filter((c) => c.alive)
            .sort((a, b) => b.baseStatistics.speed - a.baseStatistics.speed)
            .forEach((character) => {
                const action = actions.find((a) => a.allyId === character.id);
                if (action) {
                    const move = character.moves.find((m) => m.uid === action.moveUid);
                    const target = [...this.allies, ...this.enemies]
                        .filter((c) => c.alive)
                        .find((c) => c.id === action.targetId);
                    if (move && target) {
                        turnResults.push(
                            ...this.executeAllyTurn({ ally: character as BattleAlly, move, target }),
                        );
                    } else {
                        // Invalid move or dead target
                    }
                } else {
                    turnResults.push(
                        ...this.executeEnemyTurn({ enemy: character as BattleEnemy, allies: this.allies }),
                    );
                }
            });
        this.turnNumber++;
        let battleResult = undefined;
        if (this.enemies.filter((e) => e.alive).length === 0) {
            battleResult = {
                victory: true,
                experience: BattleResultsManager.awardExperience({
                    enemies: this.enemies,
                    allies: this.allies,
                }),
                gold: BattleResultsManager.awardGold({ enemies: this.enemies }),
                loots: BattleResultsManager.awardLoots({ enemies: this.enemies }),
            };
            this.enemies.forEach((e) => {
                QuestManager.updateKillQuestProgress({ enemyUid: e.uid, amount: 1 });
            });
        } else if (this.allies.filter((a) => a.alive).length === 0) {
            battleResult = {
                victory: false,
                experience: 0,
                gold: 0,
                loots: [],
            };
        }
        return {
            allies: [...this.allies],
            enemies: [...this.enemies],
            turnNumber: this.turnNumber,
            turnResults,
            battleResult,
        };
    }

    private static executeAllyTurn({
        ally,
        move,
        target,
    }: {
        ally: BattleAlly;
        move: BattleMove;
        target: BattleAlly | BattleEnemy;
    }) {
        if (!ally.alive) {
            return [];
        }
        const inflictedDamage = getMoveValueSpread(0.2) * move.damage;
        target.battleStatistics.health -= inflictedDamage;
        if (target.battleStatistics.health <= 0) {
            target.alive = false;
        }
        return [
            {
                byAlly: true,
                userId: ally.id,
                targetId: target.id,
                moveName: move.name,
                moveValue: inflictedDamage,
            },
        ];
    }

    private static executeEnemyTurn({
        enemy,
        allies,
    }: {
        enemy: BattleEnemy;
        allies: BattleAlly[]; // TODO - enemy may target enemy
    }) {
        if (!enemy.alive || !allies.filter((a) => a.alive).length) {
            return [];
        }
        const enemyMove = enemy.moves[0];
        const enemyTarget = getRandomItem(allies.filter((a) => a.alive));
        const inflictedDamage = getMoveValueSpread(0.2) * enemyMove.damage;
        enemyTarget.battleStatistics.health -= inflictedDamage;
        if (enemyTarget.battleStatistics.health <= 0) {
            enemyTarget.alive = false;
        }
        return [
            {
                byAlly: false,
                userId: enemy.id,
                targetId: enemyTarget.id,
                moveName: enemyMove.name,
                moveValue: inflictedDamage,
            },
        ];
    }
}
