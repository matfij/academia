import { Enemy } from '../enemies/types';
import { InventoryManager } from '../items/InventoryManager';
import { Loot } from '../items/types';
import { PartyManager } from '../party/PartyManager';
import { Ally } from '../party/types';
import { chance, spread } from '../.shared/math';

export class BattleResultsManager {
    public static awardExperience({ enemies, allies }: { enemies: Enemy[]; allies: Ally[] }) {
        const expGain = +enemies
            .map((e) => e.experience)
            .reduce((sum, curr) => spread(0.9, 1.1) * curr + sum)
            .toFixed(1);
        allies.forEach((a) => PartyManager.awardExperience({ allyUid: a.uid, experience: expGain }));
        return expGain;
    }

    public static awardGold({ enemies }: { enemies: Enemy[] }) {
        return +enemies
            .map((e) => e.gold)
            .reduce((sum, curr) => spread(0.9, 1.1) * curr + sum)
            .toFixed(1);
    }

    public static awardLoots({ enemies }: { enemies: Enemy[] }) {
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
