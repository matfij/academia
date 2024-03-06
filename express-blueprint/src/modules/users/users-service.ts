import { ApiError } from '../../common/errors/api-error';
import { AuthService } from './auth-service';
import { UserSignupDto, UserSigninDto } from './user-definitions';
import { UsersRepository } from './users-repository';

export class UserService {
    private static repository = UsersRepository;

    public static async signup(dto: UserSignupDto) {
        const existingUser = await this.repository.findOneBy({ username: dto.username });
        if (existingUser) {
            throw new ApiError({ message: 'errors.usernameInUse' });
        }
        const hashedPassword = AuthService.hashPassword({ password: dto.password });
        const newUser = await this.repository.create({
            username: dto.username,
            password: hashedPassword,
        });
        return newUser;
    }

    public static async signin(dto: UserSigninDto) {
        const user = await this.repository.findOneBy({ username: dto.username });
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
            username: user.username,
            level: user.level,
            accessToken: accessToken,
            refreshToken: refreshToken,
        };
    }

    public static async readAll() {
        const users = await this.repository.findManyBy();
        return users;
    }

    public static async readById(id: string) {
        const user = await this.repository.findOneBy({ id });
        if (!user) {
            throw new ApiError({ message: 'errors.userNotFound' });
        }
        return user;
    }
}
