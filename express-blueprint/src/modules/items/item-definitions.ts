export type Item = {
    id: string;
    name: string;
    requiredLevel: number;
    statistics: ItemStatistics;
    userId: string;
};

export type ItemDto = {
    id: string;
    name: string;
    statistics: ItemStatistics;
    requiredLevel: number;
}

export class ItemStatistics {
    strength!: number;
    intelligence!: number;
    agility!: number;
}

export type ItemCreateDto = {
    name: string;
    requiredLevel: number;
    statistics: ItemStatistics;
};
