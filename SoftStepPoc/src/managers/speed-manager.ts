import { LocationObject } from 'expo-location';

const METERS_PER_HOUR_TO_METERS_PER_MINUTE = 60;

export const getAverageSpeed = (locations: LocationObject[]) => {
    let totalSpeed = 0;

    for (let i = 0; i < locations.length; i++) {
        if (locations[i].coords.speed) {
            totalSpeed += locations[i].coords.speed as number;
        }
    }

    return (METERS_PER_HOUR_TO_METERS_PER_MINUTE * totalSpeed) / locations.length;
};

export const getTopSpeed = (locations: LocationObject[]) => {
    let topSpeed = 0;

    for (let i = 0; i < locations.length; i++) {
        if (locations[i].coords.speed) {
            topSpeed = Math.max(topSpeed, locations[i].coords.speed as number);
        }
    }

    return METERS_PER_HOUR_TO_METERS_PER_MINUTE * topSpeed;
};

export const getCurrentSpeed = (locations: LocationObject[]) => {
    const latest = locations.at(-1)?.coords;
    if (!latest?.speed) {
        return 0;
    }
    return METERS_PER_HOUR_TO_METERS_PER_MINUTE * latest.speed;
};
