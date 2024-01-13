import { BattleCharacter } from '../battle/types';
import { Loot } from '../items/types';
import { Character } from '../.shared/types';

export type Enemy = Character & {
    level: number;
    loots: Loot[];
    experience: number;
    gold: number;
};


export type Boss = {
    uid: string;
    cooldownMS: number;
    enemies: Enemy[];
};

export type BattleEnemy = Enemy &
    BattleCharacter & {
        id: string;
    };
