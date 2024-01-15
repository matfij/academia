import { ApiError } from '../../common/api-error';
import { UserCreateDto } from './user-definitions';
import { UserModel } from './user-schema';

export class UserService {
    private static UserModel = UserModel;

    public static async createUser(dto: UserCreateDto) {
        const existingUser = await this.UserModel.findOne({ login: dto.login });
        if (existingUser) {
            throw new ApiError({ message: 'errors.loginInUse' });
        }
        const newUser = await UserModel.create(dto);
        return {
            id: newUser.id,
            login: newUser.login,
            level: newUser.level,
        };
    }

    public static async readUsers() {
        const users = await UserModel.find();
        return users.map((user) => ({
            id: user.id,
            login: user.login,
            level: user.level,
        }));
    }
}
