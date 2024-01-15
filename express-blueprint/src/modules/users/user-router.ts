import { Router, Request, Response, NextFunction } from 'express';

export class UsersRouter {
    private readonly basePath = '/users';
    public readonly router = Router();

    constructor() {
        this.router.post(`${this.basePath}/create`, this.create);
    }

    private create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            res.status(200).json({ req: req.baseUrl + 'xd' });
        } catch (err) {
            next(err);
        }
    };
}
