import { BattleManager } from '../battle/BattleManager';
import { CHARACTER_1, CHARACTER_2, CHARACTER_3 } from './characters/characters-1';
import { Ally, BattleAlly } from './types';

export class PartyManager {
    private static allies: Ally[] = [
        { id: 'cuid-01', ...CHARACTER_1 },
        { id: 'cuid-02', ...CHARACTER_2 },
        { id: 'cuid-03', ...CHARACTER_3 },
    ];

    public static getParty() {
        return this.allies;
    }

    public static getBattleParty() {
        const battleAllies: BattleAlly[] = this.allies.map((ally) => ({
            ...ally,
            alive: true,
            battleStatistics: BattleManager.getBattleStatistics({ character: ally }),
        }));
        return battleAllies;
    }
}
