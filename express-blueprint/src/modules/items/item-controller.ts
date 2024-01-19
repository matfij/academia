import { Body, Controller, Post, Route } from 'tsoa';
import { ItemService } from './item-service';
import { ItemCreateDto, ItemReadByUserDto } from './item-definitions';

@Route('items')
export class ItemController extends Controller {
    @Post()
    public async create(@Body() dto: ItemCreateDto) {
        try {
            return await ItemService.createItem(dto);
        } catch (err) {
            throw err;
        }
    }

    @Post('byUser')
    public async readByUser(@Body() dto: ItemReadByUserDto) {
        try {
            return await ItemService.readUserItems(dto);
        } catch (err) {
            throw err;
        }
    }
}
