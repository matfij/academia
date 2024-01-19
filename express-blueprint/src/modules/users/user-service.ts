import { ApiError } from '../../common/api-error';
import { AuthService } from './auth-service';
import { UserCreateDto, UserLoginDto } from './user-definitions';
import { UserModel } from './user-schema';

export class UserService {
    private static UserModel = UserModel;

    public static async createUser(dto: UserCreateDto) {
        const existingUser = await this.UserModel.findOne({ login: dto.login });
        if (existingUser) {
            throw new ApiError({ message: 'errors.loginInUse' });
        }
        const hashedPassword = AuthService.hashPassword({ password: dto.password });
        const newUser = await UserModel.create({
            login: dto.login,
            password: hashedPassword,
        });
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

    public static async readUserById(id: string) {
        const user = await UserModel.findOne({ _id: id });
        if (!user) {
            throw new ApiError({ message: 'errors.userNotFound' });
        }
        return {
            id: user.id,
            login: user.login,
            level: user.level,
        };
    }

    public static async login(dto: UserLoginDto) {
        const user = await UserModel.findOne({ login: dto.login });
        if (!user) {
            throw new ApiError({ message: 'errors.incorrectCredentials' });
        }
        if (!AuthService.checkPassword({ password: dto.password, hashed: user.password })) {
            throw new ApiError({ message: 'errors.incorrectCredentials' });
        }
        const accessToken = AuthService.generateAccessToken({ userId: user.id });
        const refreshToken = AuthService.generateRefreshToken({ userId: user.id });
        return {
            id: user.id,
            login: user.login,
            level: user.level,
            accessToken: accessToken,
            refreshToken: refreshToken,
        };
    }
}
