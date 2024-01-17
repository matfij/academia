import { Schema, model } from 'mongoose';
import { User } from './user-definitions';
import { STARTING_LEVEL } from '../../config/game-config';

const userSchema = new Schema<User>(
    {
        id: {
            type: String,
        },
        login: {
            type: String,
            required: true,
            uniqie: true,
        },
        password: {
            type: String,
            required: true,
        },
        level: {
            type: Number,
            default: STARTING_LEVEL,
        },
        items: [{ type: Schema.Types.ObjectId, ref: 'Item' }],
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

export const UserModel = model<User>('User', userSchema);
