import { Request, Response, NextFunction } from 'express';
import { ValidateError } from 'tsoa';
import { ErrorLogger } from './error-logger';
import { ApiError, ApiErrorCode } from './api-error';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorMiddleware = (error: Error, req: Request, res: Response, _: NextFunction) => {
    saveLog({ error, req });
    if (error instanceof ValidateError) {
        return res.status(ApiErrorCode.BadRequest).send({
            code: ApiErrorCode.BadRequest,
            message: 'errors.invalidRequestBody',
            details: error.fields,
        });
    }
    if (error instanceof ApiError && error.isOperational) {
        return res.status(ApiErrorCode.BadRequest).send({
            code: error.code,
            message: error.message,
        });
    }
    return res.status(ApiErrorCode.InternalServerError).send({
        code: ApiErrorCode.InternalServerError,
        message: 'errors.internalServerError',
        details: error.message,
    });
};

const saveLog = ({ error, req }: { error: Error; req: Request }) => {
    const log = `${new Date().toISOString()}; ${req.method}; ${req.path}; ${req.ip}; ${JSON.stringify(
        req.body,
    )}; ${error};\n`;
    ErrorLogger.saveLog({ log });
};
