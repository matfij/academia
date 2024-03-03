import { Body, Controller, Get, Middlewares, Path, Post, Route, Tags } from 'tsoa';
import { UserService } from './users-service';
import { UserSignedDto, UserSignupDto, UserDto, UserSigninDto } from './user-definitions';
import { authMiddleware } from '../../common/auth-middleware';

@Route('users')
@Tags('Users')
export class UsersController extends Controller {
    @Post('signup')
    public async signup(@Body() dto: UserSignupDto): Promise<UserDto> {
        return await UserService.signup(dto);
    }

    @Post('signin')
    public async signin(@Body() dto: UserSigninDto): Promise<UserSignedDto> {
        return await UserService.signin(dto);
    }

    @Get('readAll')
    @Middlewares(authMiddleware)
    public async readAll(): Promise<UserDto[]> {
        return await UserService.readAll();
    }

    @Get('readById/{userId}')
    @Middlewares(authMiddleware)
    public async readById(@Path() userId: string): Promise<UserDto> {
        return await UserService.readById(userId);
    }
}
