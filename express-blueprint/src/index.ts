import { app } from './server';
import { PORT } from './.config/app-config';

const server = app.listen(PORT, () => {
    console.log('Server started on port: ', PORT);
});

const onCloseSignal = () => {
    server.close(() => {
        process.exit();
    });
};

process.on('SIGINT', onCloseSignal);
process.on('SIGTERM', onCloseSignal);
