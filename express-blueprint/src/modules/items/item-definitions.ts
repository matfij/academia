export type Item = {
    id: string;
    name: string;
    requiredLevel: number;
    statistics: ItemStatistics;
    userId: string;
};

export class ItemStatistics {
    strength!: number;
    intelligence!: number;
    agility!: number;
}

export type ItemCreateDto = {
    userId: string;
    name: string;
    requiredLevel: number;
    statistics?: ItemStatistics;
};
