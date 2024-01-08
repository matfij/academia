import { BattleCharacter } from '../battle/types';
import { Character } from '../shared/types';

export type Ally = Character & {
    id: string;
    inParty: boolean;
    partyIndex: number;
};

export type BattleAlly = Ally & BattleCharacter;
