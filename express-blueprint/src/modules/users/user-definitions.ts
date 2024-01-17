import type { Item } from '../items/item-definitions';

export type User = {
    id: string;
    login: string;
    password: string;
    level: number;
    items: Item[];
};

export type UserCreateDto = {
    login: string;
    password: string;
};
