import mongoose from 'mongoose';
import { app } from './server';
import { DB_URI, APP_PORT } from './common/config';

const server = app.listen(APP_PORT, () => {
    console.log('Server started on port: ', APP_PORT);
    mongoose.connect(DB_URI).then(() => console.log('DB connected'));
});

const onCloseSignal = () => {
    server.close(() => {
        process.exit();
    });
};

process.on('SIGINT', onCloseSignal);
process.on('SIGTERM', onCloseSignal);
