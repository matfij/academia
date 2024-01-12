import { Enemy } from '../enemies/types';
import { InventoryManager } from '../items/InventoryManager';
import { Loot } from '../items/types';
import { chance } from '../shared/math';

export class BattleResultsManager {
    public static calculateExperienceGain({ enemies }: { enemies: Enemy[] }) {
        return +enemies
            .map((e) => e.baseStatistics.health)
            .reduce((sum, curr) => sum + curr / 10)
            .toFixed(1);
    }

    public static calculateGoldGain({ enemies }: { enemies: Enemy[] }) {
        return +enemies
            .map((e) => e.baseStatistics.health)
            .reduce((sum, curr) => sum + curr / 30)
            .toFixed(1);
    }

    public static getLoots({ enemies }: { enemies: Enemy[] }) {
        const loots: Loot[] = [];
        enemies.forEach((enemy) => {
            enemy.loots.forEach((loot) => {
                if (chance(loot.chance)) {
                    loots.push(loot);
                    InventoryManager.appendItem({ uid: loot.itemUid });
                }
            });
        });
        return loots;
    }
}
