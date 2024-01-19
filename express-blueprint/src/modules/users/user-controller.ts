import { Body, Controller, Get, Path, Post, Route } from 'tsoa';
import { UserService } from './user-service';
import { UserAuthDto, UserCreateDto, UserDto, UserLoginDto } from './user-definitions';

@Route('users')
export class UserController extends Controller {
    @Post()
    public async create(@Body() dto: UserCreateDto): Promise<UserDto> {
        try {
            return await UserService.createUser(dto);
        } catch (err) {
            throw err;
        }
    }

    @Get()
    public async readAll(): Promise<UserDto[]> {
        try {
            return await UserService.readUsers();
        } catch (err) {
            throw err;
        }
    }

    @Get('{userId}')
    public async readById(@Path() userId: string): Promise<UserDto> {
        try {
            return await UserService.readUserById(userId);
        } catch (err) {
            throw err;
        }
    }

    @Post('login')
    public async login(@Body() dto: UserLoginDto): Promise<UserAuthDto> {
        try {
            return await UserService.login(dto);
        } catch (err) {
            throw err;
        }
    }
}
