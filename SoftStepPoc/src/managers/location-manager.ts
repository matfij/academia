import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    Accuracy,
    LocationObject,
    PermissionStatus,
    requestBackgroundPermissionsAsync,
    requestForegroundPermissionsAsync,
    startLocationUpdatesAsync,
} from 'expo-location';
import * as TaskManager from 'expo-task-manager';

export const LOCATION_TASK_NAME = 'background-location-task';
export const LOCATION_STORAGE_KEY = 'tracked-locations';

export const startLocationTracking = async () => {
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

TaskManager.defineTask<{ locations: LocationObject[] }>(LOCATION_TASK_NAME, async ({ data, error }) => {
    if (error) {
        console.error('Location task error:', error);
        return;
    }
    const stored = await AsyncStorage.getItem(LOCATION_STORAGE_KEY);
    const locations = stored ? JSON.parse(stored) : [];
    locations.push(...data.locations);
    await AsyncStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(locations));
    console.log('Saved locations:', locations.length);
});
