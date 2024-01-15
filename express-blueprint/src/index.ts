import { app } from './server';
import { DB_URI, PORT } from './config/app-config';
import mongoose from 'mongoose';

const server = app.listen(PORT, () => {
    console.log('Server started on port: ', PORT);
    mongoose.connect(DB_URI).then(() => console.log('DB connected'));
});

const onCloseSignal = () => {
    server.close(() => {
        process.exit();
    });
};

process.on('SIGINT', onCloseSignal);
process.on('SIGTERM', onCloseSignal);
