import { Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { ApiError, ApiErrorCode } from './errors/api-error';
import { ACCESS_TOKEN_SECRET } from './config';
import { AuthRequest } from './types';
import { Socket } from 'socket.io';
import { ExtendedError } from 'socket.io/dist/namespace';

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

export const ioAuthMiddleware = (socket: Socket, next: (err?: ExtendedError) => void) => {
    console.log(socket.request.headers, 'socket.request.headers');
    const authHeader = socket.request.headers['authorization'];
    console.log('authHeader', authHeader);
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        // return next();
        return next(new ApiError({ code: ApiErrorCode.Unauthorized, message: 'errors.unauthorized' }));
    }
    try {
        const token = authHeader.replace('Bearer ', '');
        const payload = jwt.verify(token, ACCESS_TOKEN_SECRET) as JwtPayload & { userId: string };
        socket.data['userId'] = payload.userId;
        return next();
    } catch (err) {
        // return next();
        return next(new ApiError({ code: ApiErrorCode.Unauthorized, message: 'errors.unauthorized' }));
    }
};
