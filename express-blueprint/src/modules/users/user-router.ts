import { Router, Request, Response, NextFunction } from 'express';
import { UserService } from './user-service';

export class UsersRouter {
    private readonly basePath = '/users';
    public readonly router = Router();

    constructor() {
        this.router.post(`${this.basePath}/create`, this.create);
        this.router.get(`${this.basePath}/readAll`, this.readAll);
    }

    private create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = req.body;
            const user = await UserService.createUser(dto);
            res.status(200).json({ user });
        } catch (err) {
            next(err);
        }
    };

    private readAll = async (_: Request, res: Response, next: NextFunction) => {
        try {
            const users = await UserService.readUsers();
            res.status(200).json({ users });
        } catch (err) {
            next(err);
        }
    };
}
