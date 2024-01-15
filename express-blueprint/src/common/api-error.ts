export enum ApiErrorName {
    BadRequest = 'BadRequest',
    NotFound = 'NotFound',
    PermissionDenied = 'PermissionDenied',
    MissingData = 'MissingData',
}

export enum ApiErrorCode {
    BadRequest = 400,
}

export class ApiError extends Error {
    override readonly name: ApiErrorName;
    readonly code: number;
    readonly isOperational: boolean;

    constructor({
        name = ApiErrorName.BadRequest,
        code = ApiErrorCode.BadRequest,
        message,
        isOperational = true,
    }: {
        name?: ApiErrorName;
        code?: number;
        message: string;
        isOperational?: boolean;
    }) {
        super(message);
        this.name = name;
        this.code = code;
        this.message = message;
        this.isOperational = isOperational;

        // make base Error props and methods available on the ApiError (optional)
        Object.setPrototypeOf(this, ApiError.prototype);

        // start tracking call stack from ApiError, omitting base Error detailss (optional)
        Error.captureStackTrace(this);
    }
}
