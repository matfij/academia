import { ApiError, ApiErrorCode, ApiErrorName } from '../../common/errors/api-error';
import { Item } from './item-definitions';
import { ItemModel } from './item-schema';

export class ItemsRepository {
    private static model = ItemModel;

    static async create({ name, requiredLevel, statistics, userId }: Omit<Item, 'id'>): Promise<Item> {
        const newItem = await this.model.create({
            name: name,
            requiredLevel: requiredLevel,
            statistics: statistics,
            userId: userId,
        });
        return {
            id: newItem.id,
            name: newItem.name,
            statistics: newItem.statistics,
            requiredLevel: newItem.requiredLevel,
            userId,
        };
    }

    static async findOneBy(query: Partial<Item>): Promise<Item | undefined> {
        const item = (await this.model.findOne(query))?.toObject();
        if (!item) {
            return undefined;
        }
        return {
            id: item.id,
            name: item.name,
            statistics: item.statistics,
            requiredLevel: item.requiredLevel,
            userId: item.userId,
        };
    }

    static async findManyBy(query: Partial<Item> = {}): Promise<Item[]> {
        const items = await this.model.find(query);
        return items.map((item) => ({
            id: item.id,
            name: item.name,
            statistics: item.statistics,
            requiredLevel: item.requiredLevel,
            userId: item.userId,
        }));
    }

    static async update({ id, data }: { id: string; data: Partial<Item> }): Promise<Item> {
        const item = await this.model.findOneAndUpdate({ id }, { $set: data });
        if (!item) {
            throw new ApiError({
                name: ApiErrorName.NotFound,
                code: ApiErrorCode.NotFound,
                message: 'errors.itemNotFound',
            });
        }
        return {
            id: item.id,
            name: item.name,
            statistics: item.statistics,
            requiredLevel: item.requiredLevel,
            userId: item.userId,
        };
    }

    static async delete({ id }: { id: string }) {
        await this.model.findOneAndDelete({ id });
    }
}
