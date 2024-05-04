import { cache as reactCache } from 'react';
import { unstable_cache as nextCache } from 'next/cache';

type Callback = (...args: unknown[]) => Promise<unknown>;

export const cache = <T extends Callback>(
    callback: T,
    keyParts: string[],
    options: { revalidate?: number | false; tags?: string[] } = {},
) => {
    return nextCache(reactCache(callback), keyParts, options);
};
