import { BattleCharacter } from '../battle/types';
import { Character } from '../.shared/types';

export type Ally = Character & {
    id: string;
    inParty: boolean;
    partyIndex: number;
    level: number;
    experience: number;
    statPoints: number;
    movePoints: number;
};

export type BattleAlly = Ally & BattleCharacter;

export type Level = {
    level: number;
    experienceRequired: number;
}
