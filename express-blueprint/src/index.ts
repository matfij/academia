import mongoose from 'mongoose';
import { app, ioServer } from './server';
import { DB_URI, APP_PORT, WS_PORT } from './common/config';

const server = app.listen(APP_PORT, () => {
    console.log(`Server started on port: ${APP_PORT}`);
    mongoose.connect(DB_URI).then(() => console.log('DB connected'));
});

ioServer.listen(WS_PORT, () => {
    console.log(`IO Server started on port: ${WS_PORT}`);
});

const onCloseSignal = () => {
    server.close(() => {
        process.exit();
    });
    ioServer.close(() => {
        process.exit();
    });
};

process.on('SIGINT', onCloseSignal);
process.on('SIGTERM', onCloseSignal);
