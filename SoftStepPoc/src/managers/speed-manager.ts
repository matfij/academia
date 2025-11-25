import { LocationObject } from 'expo-location';

export const getSpeed = (locations: LocationObject[]) => {
    const latest = locations.at(-1)?.coords;
    if (!latest?.speed) {
        return 0;
    }
    return 60 * latest.speed;
};
