import AsyncStorage from '@react-native-async-storage/async-storage';
import { stopLocationUpdatesAsync } from 'expo-location';
import { useEffect, useRef, useState } from 'react';
import { AppState, Button, Text, View } from 'react-native';
import { StepsCard, StepsCardHandle } from './_components/steps-card';
import {
    LOCATION_STORAGE_KEY,
    LOCATION_TASK_NAME,
    startLocationTracking,
} from './_managers/location-manager';

export default function HomePage() {
    const appState = useRef(AppState.currentState);
    const [isTracking, setIsTracking] = useState(false);
    const [locations, setLocations] = useState<any[]>([]);
    const [error, setError] = useState(null);
    const stepsCardRef = useRef<StepsCardHandle>(null);

    // Refresh current position
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
        if (!isTracking) {
            return;
        }
        const interval = setInterval(async () => {
            try {
                const stored = await AsyncStorage.getItem(LOCATION_STORAGE_KEY);
                if (stored) {
                    setLocations(JSON.parse(stored));
                }
            } catch (err) {
                console.error('Failed to load locations:', err);
            }
        }, 2000);
        return () => {
            clearInterval(interval);
        };
    }, [isTracking]);

    const onStart = async () => {
        if (appState.current !== 'active') {
            console.warn('Cannot start tracking when app is not in foreground');
            return;
        }

        try {
            await startLocationTracking();
            stepsCardRef.current?.start();
            setIsTracking(true);
        } catch (error) {
            console.error('Failed to start tracking:', error);
        }
    };

    const onStop = async () => {
        try {
            await stopLocationUpdatesAsync(LOCATION_TASK_NAME);
            stepsCardRef.current?.stop();
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

            <StepsCard ref={stepsCardRef} />

            <Button title="Start" onPress={onStart} disabled={isTracking} />
            <Button title="Stop" onPress={onStop} disabled={!isTracking} />
        </View>
    );
}
