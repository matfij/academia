import { Body, Controller, Middlewares, Post, Route, Request } from 'tsoa';
import { ItemService } from './item-service';
import { ItemCreateDto } from './item-definitions';
import { authMiddleware } from '../../common/auth-middleware';
import { AuthRequest } from '../../common/types';

@Route('items')
@Middlewares(authMiddleware)
export class ItemController extends Controller {
    @Post()
    public async create(@Request() req: AuthRequest, @Body() dto: ItemCreateDto) {
        try {
            return await ItemService.createItem({ userId: req.userId, dto });
        } catch (err) {
            throw err;
        }
    }

    @Post('byUser')
    public async readByUser(@Request() req: AuthRequest) {
        try {
            return await ItemService.readUserItems({ userId: req.userId });
        } catch (err) {
            throw err;
        }
    }
}