import { Schema, Document, model } from 'mongoose';
import { User } from './user-definitions';
import { STARTING_LEVEL } from '../../config/game-config';

const userSchema = new Schema(
    {
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

export const UserModel = model<User & Document>('User', userSchema);
