import { CharacterClass } from '../shared/types';

export type Item = {
    uid: string;
    name: string;
    description?: string;
    type: ItemType;
    imageUrl: string;
    levelRequired?: number;
    classesRequired?: CharacterClass[];
    statistics?: ItemStatistics;
};

export enum ItemType {
    Quest = 'Quest',
    Material = 'Material',
    Consumable = 'Consumable',
    Weapon = 'Weapon',
    Armor = 'Armor',
    Charm = 'Charm',
}

export type ItemStatistics = {
    health?: number;
    mana?: number;
    damage?: number;
    armor?: number;
    speed?: number;
    criticalChance?: number;
    criticalPower?: number;
};
