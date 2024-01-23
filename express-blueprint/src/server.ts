import express from 'express';
import { RegisterRoutes } from './.generated/routes';
import { errorMiddleware } from './common/error-middleware';
import { ApiError, ApiErrorCode } from './common/api-error';

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

RegisterRoutes(app);

app.use(() => {
    throw new ApiError({ code: ApiErrorCode.NotFound, message: 'errors.notFound' });
});
app.use(errorMiddleware);
