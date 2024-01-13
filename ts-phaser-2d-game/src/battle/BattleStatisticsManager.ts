import { BaseStatistics, CharacterPotential } from '../.shared/types';
import { Enemy } from '../enemies/types';
import { Ally } from '../party/types';
import { BattleStatistics } from './types';

export class BattleStatisticsManager {
    public static getEnemyStatistics({ enemy }: { enemy: Enemy }) {
        const statistics: BattleStatistics = {} as BattleStatistics;
        for (const property in enemy.baseStatistics) {
            statistics[property as keyof BattleStatistics] =
                enemy.baseStatistics[property as keyof BaseStatistics] +
                enemy.level * enemy.potential[property as keyof CharacterPotential];
        }
        return statistics;
    }

    public static getAllyStatistics({ ally }: { ally: Ally }) {
        // TODO - add eq stats
        return {
            maxHealth: ally.baseStatistics.health,
            health: ally.baseStatistics.health,
            maxMana: ally.baseStatistics.mana,
            mana: ally.baseStatistics.mana,
            physicalDef: ally.baseStatistics.physicalDef,
            physicalAtk: ally.baseStatistics.physicalAtk,
            speed: ally.baseStatistics.speed,
            criticalChance: ally.baseStatistics.criticalChance,
            criticalPower: ally.baseStatistics.criticalPower,
        } as BattleStatistics;
    }
}
