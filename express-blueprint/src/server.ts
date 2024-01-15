import express from 'express';
import { UsersRouter } from './modules/users/user-router';

export const app = express();

app.use(express.json());

app.use(new UsersRouter().router);
