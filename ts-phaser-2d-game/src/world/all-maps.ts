import { MAP_1 } from './maps/map-1';
import { MAP_2 } from './maps/map-2';
import { AdventureMap } from './types';

export const ALL_MAPS: AdventureMap[] = [MAP_1, MAP_2];

export const getMap = ({ uid }: { uid: string }) => {
    const map = ALL_MAPS.find((m) => m.uid === uid);
    if (!map) {
        throw new Error('Map not found');
    }
    return { ...map };
};
