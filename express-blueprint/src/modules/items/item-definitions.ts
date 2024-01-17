import type { User } from '../users/user-definitions';

export type Item = {
    id: string;
    name: string;
    requiredLevel: number;
    statistics: ItemStatistics;
    user: User;
};

export class ItemStatistics {
    strength!: number;
    intelligence!: number;
    agility!: number;
}
