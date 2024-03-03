import { ItemCreateDto, ItemDto } from './item-definitions';
import { ItemModel } from './item-schema';

export class ItemsService {
    private static model = ItemModel;

    public static async createItem({
        userId,
        dto,
    }: {
        userId: string;
        dto: ItemCreateDto;
    }): Promise<ItemDto> {
        const newItem = await this.model.create({
            name: dto.name,
            requiredLevel: dto.requiredLevel,
            statistics: dto.statistics,
            userId: userId,
        });
        return {
            id: newItem.id,
            name: newItem.name,
            statistics: newItem.statistics,
            requiredLevel: newItem.requiredLevel,
        };
    }

    public static async readByUser({ userId }: { userId: string }): Promise<ItemDto[]> {
        const items = await this.model.find({ userId });
        return items.map((item) => ({
            id: item.id,
            name: item.name,
            statistics: item.statistics,
            requiredLevel: item.requiredLevel,
        }));
    }
}
