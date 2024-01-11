import { CharacterClass } from '../shared/types';
import { Item, ItemType } from './types';

export const ITEM_QUEST_1: Item = {
    uid: 'item-q-1',
    name: 'Stolen Pendant',
    type: ItemType.Quest,
    imageUrl: 'material-icon.png',
};

export const ITEM_MATERIAL_1: Item = {
    uid: 'item-i-1',
    name: 'Shiny Stone',
    type: ItemType.Material,
    imageUrl: 'material-icon.png',
};

export const ITEM_CONSUMABLE_1: Item = {
    uid: 'item-con-1',
    name: 'Ultra Divine Water',
    description: 'Permanently increases all base statistics by 10',
    type: ItemType.Consumable,
    imageUrl: 'consumable-icon.png',
};

export const ITEM_WEAPON_1: Item = {
    uid: 'item-w-1',
    name: 'Rusty Edge',
    type: ItemType.Weapon,
    imageUrl: 'sword-icon.png',
    levelRequired: 3,
    classesRequired: [CharacterClass.Warrior],
    statistics: {
        damage: 5,
        speed: 3,
    },
};

export const ITEM_WEAPON_2: Item = {
    uid: 'item-w-2',
    name: 'Composite Bow',
    type: ItemType.Weapon,
    imageUrl: 'bow-icon.png',
    levelRequired: 3,
    classesRequired: [CharacterClass.Hunter],
    statistics: {
        damage: 7,
        speed: 2,
    },
};

export const ITEM_WEAPON_3: Item = {
    uid: 'item-w-3',
    name: 'Ruby Staff',
    type: ItemType.Weapon,
    imageUrl: 'staff-icon.png',
    levelRequired: 3,
    classesRequired: [CharacterClass.Wizzard],
    statistics: {
        damage: 6,
        speed: 2,
    },
};

export const ITEM_ARMOR_1: Item = {
    uid: 'item-a-1',
    name: 'Plate Armor',
    type: ItemType.Armor,
    imageUrl: 'armor-icon.png',
    levelRequired: 3,
    statistics: {
        health: 50,
        armor: 10,
    },
};

export const ITEM_CHARM_1: Item = {
    uid: 'item-c-1',
    name: 'Ring of Brilliance',
    type: ItemType.Charm,
    imageUrl: 'charm-icon.png',
    levelRequired: 3,
    statistics: {
        mana: 25,
        speed: 5
    },
};
