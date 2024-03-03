import { Schema, model } from 'mongoose';
import { User } from './user-definitions';
import { generateId } from '../../common/utils';

const userSchema = new Schema<User>({
    id: {
        type: String,
        default: () => generateId(),
    },
    username: {
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
        default: 1,
    },
});

export const UserModel = model<User>('User', userSchema);
