import { Schema, Document, model } from 'mongoose';
import { User } from './user-definitions';
import { STARTING_LEVEL } from '../../config/game-config';

const userSchema = new Schema({
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
});

export const UserModel = model<User & Document>('User', userSchema);
