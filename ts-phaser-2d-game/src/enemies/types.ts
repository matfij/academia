import { BattleCharacter } from '../battle/types';
import { Character } from '../shared/types';

export type Enemy = Character; // & { loots: [] ... };

export type BattleEnemy = Enemy &
    BattleCharacter & {
        id: string;
    };
