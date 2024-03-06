import { ItemCreateDto, ItemDto } from './item-definitions';
import { ItemsRepository } from './items-repository';

export class ItemsService {
    private static repository = ItemsRepository;

    public static async createItem({
        userId,
        dto,
    }: {
        userId: string;
        dto: ItemCreateDto;
    }): Promise<ItemDto> {
        const newItem = await this.repository.create({
            name: dto.name,
            requiredLevel: dto.requiredLevel,
            statistics: dto.statistics,
            userId: userId,
        });
        return newItem;
    }

    public static async readByUser({ userId }: { userId: string }): Promise<ItemDto[]> {
        const items = await this.repository.findManyBy({ userId });
        return items;
    }
}
