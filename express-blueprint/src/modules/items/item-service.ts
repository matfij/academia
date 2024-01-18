import { ItemCreateDto, ItemReadByUserDto } from './item-definitions';
import { ItemModel } from './item-schema';

export class ItemService {
    private static model = ItemModel;

    public static async createItem(dto: ItemCreateDto) {
        const newItem = await this.model.create({
            name: dto.name,
            requiredLevel: dto.requiredLevel,
            statistics: dto.statistics,
            userId: dto.userId,
        });
        return {
            id: newItem.id,
            statistics: newItem.statistics,
            requiredLevel: newItem.requiredLevel,
        };
    }

    public static async readUserItems(dto: ItemReadByUserDto) {
        const items = await this.model.find({ userId: dto.userId });
        return items.map((item) => ({
            id: item.id,
            statistics: item.statistics,
            requiredLevel: item.requiredLevel,
        }));
    }
}
