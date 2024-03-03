import fs from 'fs';
import { ERROR_LOGS_BASE_PATH } from '../config';

export class ErrorLogger {
    private static BASE_PATH = ERROR_LOGS_BASE_PATH;

    public static saveLog({ log }: { log: string }) {
        fs.promises
            .access(this.BASE_PATH)
            .catch(() => fs.promises.mkdir(this.BASE_PATH))
            .catch((err) => console.error('Could not access log file:', err))
            .finally(() => {
                const date = new Date();
                const logFile = `${this.BASE_PATH}/${date.getFullYear()}_${date.getMonth()}_error.log`;
                fs.appendFile(logFile, log, { encoding: 'utf-8' }, (err) => {
                    if (!err) {
                        return;
                    }
                    console.error('Failed to save log:', err);
                });
            });
    }
}
