import {
    ITEM_ARMOR_1,
    ITEM_CHARM_1,
    ITEM_CONSUMABLE_1,
    ITEM_MATERIAL_1,
    ITEM_QUEST_1,
    ITEM_WEAPON_1,
    ITEM_WEAPON_2,
    ITEM_WEAPON_3,
} from './items/items';

export const ALL_ITEM_QUEST = [ITEM_QUEST_1];

export const ALL_ITEM_MATERIALS = [ITEM_MATERIAL_1];

export const ALL_ITEM_CONSUMABLES = [ITEM_CONSUMABLE_1];

export const ALL_ITEM_WEAPONS = [ITEM_WEAPON_1, ITEM_WEAPON_2, ITEM_WEAPON_3];

export const ALL_ITEM_ARMORS = [ITEM_ARMOR_1];

export const ALL_ITEM_CHARMS = [ITEM_CHARM_1];

export const ALL_ITEMS = [
    ...ALL_ITEM_QUEST,
    ...ALL_ITEM_MATERIALS,
    ...ALL_ITEM_CONSUMABLES,
    ...ALL_ITEM_WEAPONS,
    ...ALL_ITEM_ARMORS,
    ...ALL_ITEM_CHARMS,
];

export const getItem = ({ uid }: { uid: string }) => {
    const item = ALL_ITEMS.find((i) => i.uid === uid);
    if (!item) {
        throw new Error('Item not found!' + uid);
    }
    return { ...item };
};
