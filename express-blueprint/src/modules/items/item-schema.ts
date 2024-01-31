import { Schema, model } from 'mongoose';
import { Item } from './item-definitions';
import { BASE_STATISTICS } from '../../config/game-config';
import { getId } from '../../common/utils';

const itemSchema = new Schema<Item>(
    {
        id: {
            type: String,
            default: () => getId(),
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
            type: Schema.Types.Mixed, // ItemStatistics
            default: BASE_STATISTICS,
        },
        userId: {
            type: String,
            required: true,
        },
    },
);

export const ItemModel = model<Item>('Item', itemSchema);
