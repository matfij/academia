import { BattleAlly, BattleEnemy, BattleMove } from '../shared/types';

export class BattleManager {
    private static allies: BattleAlly[] = [];
    private static enemies: BattleEnemy[] = [];
    private static turnNumber = 0;

    public static startBattle({ allies, enemies }: { allies: BattleAlly[]; enemies: BattleEnemy[] }) {
        this.turnNumber = 0;
        this.allies = allies;
        this.enemies = enemies;
    }

    public static executeTurn({
        actions,
    }: {
        actions: { allyId: string; moveId: string; targetId: string }[];
    }) {
        [...this.allies, ...this.enemies]
            .sort((a, b) => b.statistics.speed - a.statistics.speed)
            .forEach((character) => {
                const action = actions.find((a) => a.allyId === character.id);
                if (action) {
                    const move = character.moves.find((m) => m.id === action.moveId);
                    const target = [...this.allies, ...this.enemies].find((c) => c.id === action.targetId);
                    if (!move || !target) {
                        throw new Error('Invalid move');
                    }
                    this.executeAllyTurn({ ally: character as BattleAlly, move, target });
                } else {
                    this.executeEnemyTurn({ enemy: character });
                }
            });

        this.turnNumber++;
    }

    private static executeAllyTurn({
        ally,
        move,
        target,
    }: {
        ally: BattleAlly;
        move: BattleMove;
        target: BattleAlly | BattleEnemy;
    }) {}

    private static executeEnemyTurn({ enemy }: { enemy: BattleEnemy }) {}
}
