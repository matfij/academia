import express, { urlencoded } from 'express';
import { RegisterRoutes } from './.generated/routes';

export const app = express();

app.use(express.json());
app.use(urlencoded({ extended: true }));

RegisterRoutes(app);
