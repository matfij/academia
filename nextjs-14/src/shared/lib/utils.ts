import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function wait(durationMs: number) {
    return new Promise((resolve) => setTimeout(resolve, durationMs));
}

export function getImagePath(path: string) {
    return `${path.replace('public', '')}`;
}

export function getEnvVar<T extends string | number | boolean>(name: string): T {
    return process.env[name] as T;
}

export async function hashPassword(password: string) {
    const arrBuff = await crypto.subtle.digest('SHA-512', new TextEncoder().encode(password));
    return Buffer.from(arrBuff).toString('base64');
}

export async function checkPassword(password: string, hash: string) {
    const hashedPassword = await hashPassword(password);
    console.log(hashedPassword);
    return hashedPassword === hash;
}
