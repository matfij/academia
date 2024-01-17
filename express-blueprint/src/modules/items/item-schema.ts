import { Schema, model } from 'mongoose';
import { Item } from './item-definitions';
import { BASE_STATISTICS } from '../../config/game-config';

const itemSchema = new Schema<Item>(
    {
        // id mapped from _id
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

export const ItemModel = model<Item>('Item', itemSchema);
