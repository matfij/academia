import { Router, Request, Response, NextFunction } from 'express';
import { ItemService } from './item-service';

export class ItemRouter {
    private readonly basePath = '/items';
    public readonly router = Router();

    constructor() {
        this.router.post(`${this.basePath}/create`, this.create);
        this.router.post(`${this.basePath}/readByUser`, this.readByUser);
    }

    private create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = req.body;
            const item = await ItemService.createItem(dto);
            res.status(200).json({ item });
        } catch (err) {
            next(err);
        }
    };

    private readByUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.body.userId;
            const items = await ItemService.readUserItems(userId);
            res.status(200).json({ items });
        } catch (err) {
            next(err);
        }
    };
}
