import { Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { ApiError, ApiErrorCode } from './api-error';
import { ACCESS_TOKEN_SECRET } from '../config/app-config';
import { AuthRequest } from './types';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const authMiddleware = (req: AuthRequest, _: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new ApiError({ code: ApiErrorCode.Unauthorized, message: 'errors.unauthorized' });
    }
    try {
        const token = authHeader.replace('Bearer ', '');
        const payload = jwt.verify(token, ACCESS_TOKEN_SECRET) as JwtPayload & { userId: string };
        req.userId = payload['userId'];
        next();
    } catch (err) {
        throw new ApiError({ code: ApiErrorCode.Unauthorized, message: 'errors.unauthorized' });
    }
};
