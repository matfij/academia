import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import { LOCATION_STORAGE_KEY, LOCATION_TASK_NAME, startLocationTracking } from './location-manager';

export const useActivityTracking = () => {
    const appState = useRef(AppState.currentState);
    const [isTracking, setIsTracking] = useState(false);

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
            const stored = await AsyncStorage.getItem(LOCATION_STORAGE_KEY);
            if (stored) {
                console.log('Loaded locations', stored);
            }
        }, 2000);
        return () => {
            clearInterval(interval);
        };
    }, [isTracking]);

    const start = async () => {
        if (isTracking) {
            return;
        }
        await startLocationTracking();
        setIsTracking(true);
        console.log('Background location service started.');
    };

    const stop = async () => {
        const isLocationTracked = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
        if (isLocationTracked) {
            await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
            setIsTracking(false);
            console.log('Background location service stopped.');
        }
    };

    return {
        isTracking,
        start,
        stop,
    };
};
