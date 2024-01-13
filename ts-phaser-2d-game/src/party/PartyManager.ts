import { BaseStatistics, CharacterPotential } from '../.shared/types';
import { BattleStatisticsManager } from '../battle/BattleStatisticsManager';
import { PARTY_INDEXES, PARTY_SIZE_MAX, PARTY_SIZE_MIN } from '../config';
import {
    CHARACTER_1,
    CHARACTER_2,
    CHARACTER_3,
    CHARACTER_4,
    CHARACTER_5,
    CHARACTER_6,
} from './characters/characters-1';
import { getLevel } from './characters/levels';
import { Ally, BattleAlly } from './types';

export class PartyManager {
    private static allies: Ally[] = [
        {
            id: 'cuid-01',
            inParty: true,
            partyIndex: 0,
            ...CHARACTER_1,
            level: 1,
            experience: 0,
            statPoints: 3,
            movePoints: 3,
        },
        {
            id: 'cuid-02',
            inParty: true,
            partyIndex: 1,
            ...CHARACTER_2,
            level: 1,
            experience: 0,
            statPoints: 3,
            movePoints: 3,
        },
        {
            id: 'cuid-03',
            inParty: true,
            partyIndex: 2,
            ...CHARACTER_3,
            level: 1,
            experience: 0,
            statPoints: 3,
            movePoints: 3,
        },
        {
            id: 'cuid-04',
            inParty: false,
            partyIndex: 0,
            ...CHARACTER_4,
            level: 1,
            experience: 0,
            statPoints: 3,
            movePoints: 3,
        },
        {
            id: 'cuid-05',
            inParty: false,
            partyIndex: 0,
            ...CHARACTER_5,
            level: 1,
            experience: 0,
            statPoints: 3,
            movePoints: 3,
        },
        {
            id: 'cuid-06',
            inParty: false,
            partyIndex: 0,
            ...CHARACTER_6,
            level: 1,
            experience: 0,
            statPoints: 3,
            movePoints: 3,
        },
    ];

    public static getParty() {
        return [...this.allies.filter((a) => a.inParty).sort((a, b) => b.partyIndex - a.partyIndex)];
    }

    public static getRoster() {
        return [...this.allies.filter((a) => !a.inParty)];
    }

    public static getBattleParty() {
        const battleAllies: BattleAlly[] = this.getParty().map((ally) => ({
            ...ally,
            alive: true,
            battleStatistics: BattleStatisticsManager.getAllyStatistics({ ally }),
        }));
        return battleAllies;
    }

    public static addToParty({ allyUid }: { allyUid: string }) {
        const party = this.getParty();
        if (party.length >= PARTY_SIZE_MAX) {
            throw new Error('Party size reached!');
        }
        const ally = this.allies.find((a) => a.uid === allyUid);
        if (!ally || ally.inParty) {
            throw new Error('Ally not found!');
        }
        const takenIndexes = party.map((p) => p.partyIndex);
        const freeIndex = PARTY_INDEXES.find((PI) => !takenIndexes.includes(PI)) || 0;
        ally.inParty = true;
        ally.partyIndex = freeIndex;
    }

    public static removeFromParty({ allyUid }: { allyUid: string }) {
        if (this.getParty().length <= PARTY_SIZE_MIN) {
            throw new Error('Party size reached!');
        }
        const ally = this.allies.find((a) => a.uid === allyUid);
        if (!ally || !ally.inParty) {
            throw new Error('Ally not found');
        }
        ally.inParty = false;
    }

    public static awardExperience({ allyUid, experience }: { allyUid: string; experience: number }) {
        const ally = this.allies.find((a) => a.uid === allyUid);
        if (!ally) {
            throw new Error('Ally not found!');
        }
        ally.experience += experience;
        const nextLevel = getLevel({ experience: ally.experience });
        const levelsGained = nextLevel.level - ally.level;
        ally.level = nextLevel.level;
        ally.statPoints += levelsGained;
        ally.movePoints += levelsGained;
        for (const property in ally.potential) {
            ally.baseStatistics[property as keyof BaseStatistics] +=
                levelsGained * ally.potential[property as keyof CharacterPotential];
        }
    }
}
