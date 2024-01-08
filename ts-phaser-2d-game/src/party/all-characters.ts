import {
    CHARACTER_1,
    CHARACTER_2,
    CHARACTER_3,
    CHARACTER_4,
    CHARACTER_5,
    CHARACTER_6,
} from './characters/characters-1';

export const ALL_CHARACTERS = [CHARACTER_1, CHARACTER_2, CHARACTER_3, CHARACTER_4, CHARACTER_5, CHARACTER_6];

export const getCharacter = ({ uid }: { uid: string }) => {
    const character = ALL_CHARACTERS.find((c) => c.uid === uid);
    if (!character) {
        throw new Error('Character not found!');
    }
    return character;
};
