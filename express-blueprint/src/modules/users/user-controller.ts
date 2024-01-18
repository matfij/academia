import { Body, Controller, Get, Path, Post, Route } from 'tsoa';
import { UserService } from './user-service';
import { UserCreateDto } from './user-definitions';

@Route('users')
export class UserController extends Controller {
    @Post()
    public async create(@Body() dto: UserCreateDto) {
        try {
            return await UserService.createUser(dto);
        } catch (err) {
            return err;
        }
    }

    @Get()
    public async readAll() {
        try {
            return await UserService.readUsers();
        } catch (err) {
            return err;
        }
    }

    @Get('{userId}')
    public async readById(@Path() userId: string) {
        try {
            return await UserService.readUserById(userId);
        } catch (err) {
            return err;
        }
    }
}
