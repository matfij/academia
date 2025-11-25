import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import { calculateRouteLength } from './distance-manager';
import { LOCATION_STORAGE_KEY, LOCATION_TASK_NAME, startLocationTracking } from './location-manager';
import { getSpeed } from './speed-manager';

const REFRESH_TIME_MS = 1000;

export const useActivityTracking = () => {
    const appState = useRef(AppState.currentState);
    const [isTracking, setIsTracking] = useState(false);
    const [distance, setDistance] = useState(0);
    const [speed, setSpeed] = useState(0);

    useEffect(() => {
        const subscription = AppState.addEventListener('change', (nextAppState) => {
            appState.current = nextAppState;
        });
        return () => {
            subscription.remove();
        };
    }, []);

    useEffect(() => {
        if (!isTracking) {
            return;
        }
        const interval = setInterval(async () => {
            try {
                const locationsRaw = await AsyncStorage.getItem(LOCATION_STORAGE_KEY);
                const locations = JSON.parse(locationsRaw ?? '[]') as Location.LocationObject[];
                console.log('Total locations', locations.length);

                // TODO - cache length up to the point
                const newDistance = Math.round(calculateRouteLength(locations));
                setDistance(newDistance);

                const newSpeed = Math.round(getSpeed(locations));
                setSpeed(newSpeed);
            } catch (err) {
                console.warn(err);
            }
        }, REFRESH_TIME_MS);
        return () => {
            clearInterval(interval);
        };
    }, [isTracking]);

    const start = async () => {
        console.log('Starting...');
        if (isTracking) {
            return;
        }
        await startLocationTracking();
        setIsTracking(true);
        console.log('Background location service started.');
    };

    const stop = async () => {
        console.log('Stopping...');
        const isLocationTracked = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
        if (isLocationTracked) {
            await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
            setIsTracking(false);
            console.log('Background location service stopped.');
        }
    };

    return {
        isTracking,
        distance,
        speed,
        start,
        stop,
    };
};
