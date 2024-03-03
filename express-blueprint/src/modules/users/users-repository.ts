import { ApiError, ApiErrorCode, ApiErrorName } from '../../common/errors/api-error';
import { User } from './user-definitions';
import { UserModel } from './user-schema';

export class UsersRepository {
    private static repository = UserModel;

    static async create({ username, password }: Pick<User, 'username' | 'password'>): Promise<User> {
        const newUser = await this.repository.create({
            username,
            password,
        });
        return {
            id: newUser.id,
            username: newUser.username,
            password: newUser.password,
            level: newUser.level,
        };
    }

    static async findOneBy(query: Partial<User>): Promise<User | undefined> {
        const user = (await this.repository.findOne(query))?.toObject();
        if (!user) {
            return undefined;
        }
        return {
            id: user.id,
            username: user.username,
            password: user.password,
            level: user.level,
        };
    }

    static async findManyBy(query: Partial<User> = {}): Promise<User[]> {
        const users = await this.repository.find(query);
        return users.map((user) => ({
            id: user.id,
            username: user.username,
            password: user.password,
            level: user.level,
        }));
    }

    static async update({ id, data }: { id: string; data: Partial<User> }): Promise<User> {
        const user = await this.repository.findOneAndUpdate({ id }, { $set: data });
        if (!user) {
            throw new ApiError({
                name: ApiErrorName.NotFound,
                code: ApiErrorCode.NotFound,
                message: 'errors.userNotFound',
            });
        }
        return {
            id: user.id,
            username: user.username,
            password: user.password,
            level: user.level,
        };
    }

    static async delete({ id }: { id: string }) {
        await this.repository.findOneAndDelete({ id });
    }
}
