// TODO - move to .env
export const PORT = 3005;
export const DB_URI = 'mongodb://root:root@db:27017';

export const ACCESS_TOKEN_SECRET = 'access-secret';
export const ACCESS_TOKEN_EXPIRE = 15 * 60 * 1000; // 15min
export const REFRESH_TOKEN_SECRET = 'refresh-secret';
export const REFRESH_TOKEN_EXPIRE = 48 * 60 * 60 * 1000; // 48h
