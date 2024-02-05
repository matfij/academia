import express from 'express';
import cors from 'cors';
import { ApiError, ApiErrorCode } from './common/errors/api-error';
import { errorMiddleware } from './common/errors/error-middleware';
import { RegisterRoutes } from './common/api/routes';

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: '*' }));

RegisterRoutes(app);

app.use(() => {
    throw new ApiError({ code: ApiErrorCode.NotFound, message: 'errors.notFound' });
});
app.use(errorMiddleware);
