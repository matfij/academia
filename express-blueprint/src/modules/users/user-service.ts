import { ApiError } from '../../common/errors/api-error';
import { AuthService } from './auth-service';
import { UserSignupDto, UserSigninDto } from './user-definitions';
import { UserRepository } from './user-repository';
import { UserModel } from './user-schema';

export class UserService {
    private static repository = UserRepository;

    public static async signup(dto: UserSignupDto) {
        const existingUser = await this.repository.findOneBy({ login: dto.login });
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
        const users = await this.repository.findManyBy();
        return users.map((user) => ({
            id: user.id,
            login: user.login,
            level: user.level,
        }));
    }

    public static async readUserById(id: string) {
        const user = await this.repository.findOneBy({ id });
        if (!user) {
            throw new ApiError({ message: 'errors.userNotFound' });
        }
        return {
            id: user.id,
            login: user.login,
            level: user.level,
        };
    }

    public static async signin(dto: UserSigninDto) {
        const user = await this.repository.findOneBy({ login: dto.login });
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
