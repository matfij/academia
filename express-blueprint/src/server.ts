import express from 'express';
import { UserRouter } from './modules/users/user-router';
import { ItemRouter } from './modules/items/item-router';

export const app = express();

app.use(express.json());

app.use(new UserRouter().router);
app.use(new ItemRouter().router);
