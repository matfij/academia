import { Schema, model } from 'mongoose';
import { User } from './user-definitions';
import { STARTING_LEVEL } from '../../config/game-config';
import { getId } from '../../common/utils';

const userSchema = new Schema<User>({
    id: {
        type: String,
        default: () => getId(),
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
});

export const UserModel = model<User>('User', userSchema);
