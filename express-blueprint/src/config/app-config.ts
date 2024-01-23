export const APP_PORT = process.env['APP_PORT']!;
export const DB_URI = process.env['DB_URI']!;

export const ACCESS_TOKEN_SECRET = process.env['ACCESS_TOKEN_SECRET']!;
export const ACCESS_TOKEN_EXPIRE = 15 * 60 * 1000; // 15min
export const REFRESH_TOKEN_SECRET = process.env['REFRESH_TOKEN_SECRET']!;
export const REFRESH_TOKEN_EXPIRE = 48 * 60 * 60 * 1000; // 48h
