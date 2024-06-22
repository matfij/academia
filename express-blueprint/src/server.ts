import express from 'express';
import cors from 'cors';
import { Server } from 'socket.io';
import { ApiError, ApiErrorCode } from './common/errors/api-error';
import { errorMiddleware } from './common/errors/error-middleware';
import { RegisterRoutes } from './common/api/routes';
import { createServer } from 'http';
import { ioAuthMiddleware } from './common/auth-middleware';

/**
 * HTTP
 */
export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: '*' }));

RegisterRoutes(app);

app.use(() => {
    throw new ApiError({ code: ApiErrorCode.NotFound, message: 'errors.notFound' });
});
app.use(errorMiddleware);

/**
 * WS
 */
export const ioServer = createServer(app);

export const io = new Server(ioServer, {
    cors: {
        origin: '*',
    },
});

io.on('connection', (socket) => {
    console.log('A user connected:', socket.data['userId']);

    socket.on('message', (message) => {
        io.emit('message', { userId: socket.data['userId'], message });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.data['userId']);
    });
});

io.use(ioAuthMiddleware);
