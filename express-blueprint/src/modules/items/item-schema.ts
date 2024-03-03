import { Schema, model } from 'mongoose';
import { Item, ItemStatistics } from './item-definitions';
import { generateId } from '../../common/utils';

const itemSchema = new Schema<Item>({
    id: {
        type: String,
        default: () => generateId(),
    },
    name: {
        type: String,
        required: true,
    },
    requiredLevel: {
        type: Number,
        required: true,
    },
    statistics: {
        type: Schema.Types.Mixed,
        default: {
            strength: 0,
            intelligence: 0,
            agility: 0,
        } as ItemStatistics,
    },
    userId: {
        type: String,
        required: true,
    },
});

export const ItemModel = model<Item>('Item', itemSchema);
