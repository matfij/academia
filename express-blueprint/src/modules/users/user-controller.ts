import { Body, Controller, Get, Middlewares, Path, Post, Route, Tags } from 'tsoa';
import { UserService } from './user-service';
import { UserAuthDto, UserSignupDto, UserDto, UserSigninDto } from './user-definitions';
import { authMiddleware } from '../../common/auth-middleware';

@Route('users')
@Tags('Users')
export class UserController extends Controller {
    @Post('signup')
    public async signup(@Body() dto: UserSignupDto): Promise<UserDto> {
        try {
            return await UserService.signup(dto);
        } catch (err) {
            throw err;
        }
    }

    @Get('readAll')
    @Middlewares(authMiddleware)
    public async readAll(): Promise<UserDto[]> {
        try {
            return await UserService.readUsers();
        } catch (err) {
            throw err;
        }
    }

    @Get('{userId}')
    @Middlewares(authMiddleware)
    public async readById(@Path() userId: string): Promise<UserDto> {
        try {
            return await UserService.readUserById(userId);
        } catch (err) {
            throw err;
        }
    }

    @Post('signin')
    public async signin(@Body() dto: UserSigninDto): Promise<UserAuthDto> {
        try {
            return await UserService.signin(dto);
        } catch (err) {
            throw err;
        }
    }
}
