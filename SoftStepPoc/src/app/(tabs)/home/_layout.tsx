import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    Accuracy,
    PermissionStatus,
    requestBackgroundPermissionsAsync,
    requestForegroundPermissionsAsync,
    startLocationUpdatesAsync,
    stopLocationUpdatesAsync,
} from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { useEffect, useRef, useState } from 'react';
import { AppState, Button, Text, View } from 'react-native';

const LOCATION_TASK_NAME = 'background-location-task';
const LOCATION_STORAGE_KEY = 'tracked-locations';

const startTracking = async () => {
    await AsyncStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify([]));

    const foregroundPermission = await requestForegroundPermissionsAsync();
    if (foregroundPermission.status === PermissionStatus.GRANTED) {
        const backgroundPermission = await requestBackgroundPermissionsAsync();
        if (backgroundPermission.status === PermissionStatus.GRANTED) {
            await startLocationUpdatesAsync(LOCATION_TASK_NAME, {
                accuracy: Accuracy.BestForNavigation,
                timeInterval: 1000,
                distanceInterval: 1,
                foregroundService: {
                    notificationTitle: 'Activity in progress',
                    notificationBody: 'Tracking your activity',
                },
            });
        }
    }
};

TaskManager.defineTask<{ locations: any }>(LOCATION_TASK_NAME, async ({ data, error }) => {
    if (error) {
        console.error('Location task error:', error);
        return;
    }
    if (data) {
        try {
            // Get existing locations
            const stored = await AsyncStorage.getItem(LOCATION_STORAGE_KEY);
            const locations = stored ? JSON.parse(stored) : [];

            // Add new locations
            locations.push(...data.locations);

            // Save back
            await AsyncStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(locations));
            console.log('Saved locations:', locations.length);
        } catch (err) {
            console.error('Failed to save location:', err);
        }
    }
});

export default function HomePage() {
    const appState = useRef(AppState.currentState);
    const [isTracking, setIsTracking] = useState(false);
    const [locations, setLocations] = useState<any[]>([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const subscription = AppState.addEventListener('change', (nextAppState) => {
            appState.current = nextAppState;
        });

        return () => {
            subscription.remove();
        };
    }, []);

    // Poll for location updates while tracking
    useEffect(() => {
        if (!isTracking) return;

        const interval = setInterval(async () => {
            try {
                const stored = await AsyncStorage.getItem(LOCATION_STORAGE_KEY);
                if (stored) {
                    setLocations(JSON.parse(stored));
                }
            } catch (err) {
                console.error('Failed to load locations:', err);
            }
        }, 2000); // Check every 2 seconds

        return () => clearInterval(interval);
    }, [isTracking]);

    const onStart = async () => {
        if (appState.current !== 'active') {
            console.warn('Cannot start tracking when app is not in foreground');
            return;
        }

        try {
            await startTracking();
            setIsTracking(true);
        } catch (error) {
            console.error('Failed to start tracking:', error);
        }
    };

    const onStop = async () => {
        try {
            await stopLocationUpdatesAsync(LOCATION_TASK_NAME);
            setIsTracking(false);
        } catch (error) {
            console.error('Failed to stop tracking:', error);
        }
    };

    return (
        <View
            style={{ height: '100%', justifyContent: 'center', alignItems: 'stretch', padding: 24, gap: 16 }}>
            <Text>Status: {isTracking ? 'Tracking' : 'Not tracking'}</Text>
            <Text>Location points: {locations.length}</Text>
            {locations.length > 0 && (
                <Text>
                    Last: {locations[locations.length - 1]?.coords?.latitude.toFixed(6)},{' '}
                    {locations[locations.length - 1]?.coords?.longitude.toFixed(6)}
                </Text>
            )}
            {error && <Text style={{ color: 'red' }}>Error: {error}</Text>}
            <Button title="Start" onPress={onStart} disabled={isTracking} />
            <Button title="Stop" onPress={onStop} disabled={!isTracking} />
        </View>
    );
}
