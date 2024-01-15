import express from 'express';
import { UsersRouter } from './modules/users/user-router';

export const app = express();

app.use(new UsersRouter().router);
