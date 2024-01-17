import { Schema, model } from 'mongoose';
import { Item, ItemStatistics } from './item-definitions';
import { BASE_STATISTICS } from '../../config/game-config';

const itemSchema = new Schema<Item>(
    {
        id: {
            type: String,
            required: true,
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
            type: ItemStatistics,
            default: BASE_STATISTICS,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    {
        toJSON: {
            transform(_, ret) {
                ret['id'] = ret['_id'];
                delete ret['_id'];
                delete ret['__v'];
            },
        },
    },
);

export const ItemModel = model<Item>('User', itemSchema);
