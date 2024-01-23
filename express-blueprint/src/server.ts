import express from 'express';
import { RegisterRoutes } from './.generated/routes';
import { errorMiddleware } from './common/error-middleware';

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

RegisterRoutes(app);

app.use(errorMiddleware);
