import { BattleCharacter } from '../battle/types';
import { Character } from '../shared/types';

export type Enemy = Character; // & { loots: [] ... };

export type Boss = {
    uid: string;
    cooldownMS: number;
    enemies: Enemy[];
}

export type BattleEnemy = Enemy &
    BattleCharacter & {
        id: string;
    };
