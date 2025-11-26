import { LocationObject } from 'expo-location';

export const getActivityDuration = (locations: LocationObject[]) => {
    if (locations.length < 2) {
        return 0;
    }
    return locations[locations.length - 1].timestamp - locations[0].timestamp;
};

export const formatDuration = (duration: number) => {
    const totalSeconds = Math.floor(duration / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours}:${padStart(minutes)}:${padStart(seconds)}`;
};

const padStart = (value: number) => {
    return value < 10 ? `0${value}` : `${value}`;
};
