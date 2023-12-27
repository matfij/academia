import { Ally, BattleAlly, Enemy } from '../shared/types';

export class BattleManager {
    private static allies: Ally[] = [];
    private static enemies: Enemy[] = [];
    private static turnNumber = 0;

    public static startBattle({ allies, enemies }: { allies: Ally[]; enemies: Enemy[] }) {
        this.turnNumber = 0;
        this.allies = allies;
        this.enemies = enemies;
    }

    public static executeTurn({ battleAllies }: { battleAllies: BattleAlly }) {
        [...this.allies, ...this.enemies]
            .sort((a, b) => b.statistics.speed - a.statistics.speed)
            .forEach((somebody) => {
                console.log(somebody.name);
            });

        
        // this.allies.forEach((ally) => {
        //     const selectedEnemy = this.enemies.find((e) => e.id === ally.selectedTargetId);
        //     const selectedMove = ally.moves.find((e) => e.id === ally.selectedMoveId);
        //     console.log(`${ally.name} attacks ${selectedEnemy?.name} with ${selectedMove?.name}`);
        // });
    }
}
