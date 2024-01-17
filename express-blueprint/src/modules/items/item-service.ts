import { ItemCreateDto } from './item-definitions';
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
        return newItem;
    }

    public static async readUserItems(userId: string) {
        const items = await this.model.find({ userId });
        return items;
    }
}
