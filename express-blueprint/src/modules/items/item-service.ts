import { ItemCreateDto } from './item-definitions';
import { ItemModel } from './item-schema';

export class ItemService {
    private static model = ItemModel;

    public static async createItem({ userId, dto }: { userId: string; dto: ItemCreateDto }) {
        const newItem = await this.model.create({
            name: dto.name,
            requiredLevel: dto.requiredLevel,
            statistics: dto.statistics,
            userId: userId,
        });
        return {
            id: newItem.id,
            statistics: newItem.statistics,
            requiredLevel: newItem.requiredLevel,
        };
    }

    public static async readUserItems({ userId }: { userId: string }) {
        const items = await this.model.find({ userId });
        return items.map((item) => ({
            id: item.id,
            statistics: item.statistics,
            requiredLevel: item.requiredLevel,
        }));
    }
}
