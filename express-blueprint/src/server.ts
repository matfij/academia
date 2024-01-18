import express, { urlencoded } from 'express';
import { RegisterRoutes } from './.generated/routes';
import { ItemRouter } from './modules/items/item-router';

export const app = express();

app.use(express.json());
app.use(urlencoded({ extended: true }));

app.use(new ItemRouter().router);

RegisterRoutes(app);
