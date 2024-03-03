import { Body, Controller, Middlewares, Post, Route, Request, Tags, Get } from 'tsoa';
import { ItemsService } from './items-service';
import { ItemCreateDto, ItemDto } from './item-definitions';
import { authMiddleware } from '../../common/auth-middleware';
import { AuthRequest } from '../../common/types';

@Route('items')
@Tags('Items')
@Middlewares(authMiddleware)
export class ItemsController extends Controller {
    @Post('create')
    public async create(@Request() req: AuthRequest, @Body() dto: ItemCreateDto): Promise<ItemDto> {
        return await ItemsService.createItem({ userId: req.userId, dto });
    }

    @Get('readByUser')
    public async readByUser(@Request() req: AuthRequest): Promise<ItemDto[]> {
        return await ItemsService.readByUser({ userId: req.userId });
    }
}
