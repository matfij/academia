import express from 'express';
import { RegisterRoutes } from './.generated/routes';
import { ApiError, ApiErrorCode } from './common/errors/api-error';
import { errorMiddleware } from './common/errors/error-middleware';

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

RegisterRoutes(app);

app.use(() => {
    throw new ApiError({ code: ApiErrorCode.NotFound, message: 'errors.notFound' });
});
app.use(errorMiddleware);
