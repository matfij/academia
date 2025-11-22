import { Pedometer } from 'expo-sensors';
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { Alert, Linking, Text, View } from 'react-native';

export interface StepsCardHandle {
    start: () => Promise<void>;
    stop: () => Promise<void>;
}

export const StepsCardPedometer = forwardRef<StepsCardHandle>(function StepsCard(props, ref) {
    const [pedometerSubscription, setPedometerSubscription] = useState<Pedometer.Subscription | null>();
    const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');
    const [currentStepCount, setCurrentStepCount] = useState(0);
    const [permissionStatus, setPermissionStatus] = useState('');

    const start = async () => {
        const isAvailable = await Pedometer.isAvailableAsync();
        setIsPedometerAvailable(isAvailable ? 'available' : 'not available');

        if (!isAvailable) {
            return;
        }

        let permission = await Pedometer.getPermissionsAsync();
        console.log('Current permission:', permission);
        setPermissionStatus(permission.status);

        if (!permission.granted) {
            if (permission.canAskAgain) {
                // Can show the system prompt
                permission = await Pedometer.requestPermissionsAsync();
                setPermissionStatus(permission.status);
            } else {
                // Permission permanently denied - must open settings
                Alert.alert(
                    'Permission Required',
                    'Physical Activity permission is required to count steps. Please enable it in app settings.',
                    [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Open Settings', onPress: () => Linking.openSettings() },
                    ],
                );
                return;
            }
        }

        if (!permission.granted) {
            console.log('Permission not granted');
            return;
        }

        console.log('Starting pedometer subscription');
        const sub = Pedometer.watchStepCount((result) => {
            console.log('Steps:', result.steps);
            setCurrentStepCount(result.steps);
        });

        setPedometerSubscription(sub);
    };

    const stop = async () => {
        if (pedometerSubscription) {
            pedometerSubscription.remove?.();
            setPedometerSubscription(null);
        }
    };

    useImperativeHandle(ref, () => ({ start, stop }), [pedometerSubscription]);

    return (
        <View>
            <Text>Pedometer status: {isPedometerAvailable}</Text>
            <Text>Permission: {permissionStatus}</Text>
            <Text>Steps count: {currentStepCount}</Text>
        </View>
    );
});
