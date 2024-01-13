import { getBoss, getEnemy } from '../enemies/all-enemies';
import { BattleEnemy } from '../enemies/types';
import { currentDate, uuid } from '../.shared/utils';
import { AdventureMap, Encounter } from './types';
import { BattleStatisticsManager } from '../battle/BattleStatisticsManager';

export class EncounterManager {
    private static bossCooldown: Record<string, number> = {};

    public static getBossCooldown({ bossUid }: { bossUid: string }) {
        return this.bossCooldown[bossUid] || 0;
    }

    public static getBossEncounter({ bossUid }: { bossUid: string }) {
        const bossData = getBoss({ uid: bossUid });
        const enemies = bossData.enemies.map((enemy) => {
            return {
                ...enemy,
                id: uuid(),
                alive: true,
                battleStatistics: BattleStatisticsManager.getEnemyStatistics({ enemy }),
            };
        });
        this.bossCooldown[bossData.uid] = currentDate() + bossData.cooldownMS;
        return enemies;
    }

    public static getEncounter({ map }: { map: AdventureMap }) {
        const groupSize = this.calculateGroupSize({ probabilities: map.groupSizeRate });
        const encounters: Encounter[] = [];
        for (let i = 0; i < groupSize; i++) {
            const randomIndex = this.getRandomIndexBasedOnRate({ encounters: map.encounters });
            encounters.push({ ...map.encounters[randomIndex] });
        }
        const enemies: BattleEnemy[] = encounters.map((encounter) => {
            const enemy = getEnemy({ uid: encounter.enemyUid });
            return {
                ...enemy,
                id: uuid(),
                alive: true,
                battleStatistics: BattleStatisticsManager.getEnemyStatistics({ enemy }),
            };
        });
        return enemies;
    }

    private static calculateGroupSize({ probabilities }: { probabilities: number[] }) {
        let groupSize = 0;
        for (let i = 0; i < probabilities.length; i++) {
            const chance = Math.random();
            if (probabilities[i] >= chance) {
                groupSize++;
                continue;
            }
            break;
        }
        return groupSize;
    }

    private static getRandomIndexBasedOnRate({ encounters }: { encounters: Encounter[] }) {
        const totalChance = encounters.reduce((sum, enemy) => sum + enemy.rate, 0);
        let randomValue = Math.random() * totalChance;
        for (let i = 0; i < encounters.length; i++) {
            randomValue -= encounters[i].rate;
            if (randomValue <= 0) {
                return i;
            }
        }
        return encounters.length - 1;
    }
}
