import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function wait(durationMs: number) {
    return new Promise((resolve) => setTimeout(resolve, durationMs));
}