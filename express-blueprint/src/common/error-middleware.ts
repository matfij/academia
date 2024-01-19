import { Request, Response, NextFunction } from 'express';
import { ValidateError } from 'tsoa';
import { ApiError, ApiErrorCode } from './api-error';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorMiddleware = (error: Error, req: Request, res: Response, _: NextFunction) => {
    // TODO - add file logger
    console.log(req.url);
    if (error instanceof ValidateError) {
        // TODO - custom TSOA error message
        return res.status(ApiErrorCode.BadRequest).send({
            message: 'errors.invalidRequestBody',
            details: error.fields,
        });
    }
    if (error instanceof ApiError && error.isOperational) {
        return res.status(ApiErrorCode.BadRequest).send({
            message: error.message,
        });
    }
    process.exit(1);
};
