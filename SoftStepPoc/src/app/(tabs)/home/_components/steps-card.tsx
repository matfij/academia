import { Pedometer } from 'expo-sensors';
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { Text, View } from 'react-native';

export interface StepsCardHandle {
    start: () => Promise<void>;
    stop: () => Promise<void>;
}

// Note: second generic is the props type
export const StepsCard = forwardRef<StepsCardHandle>(function StepsCard(props, ref) {
    const [pedometerSubscription, setPedometerSubscription] = useState<Pedometer.Subscription | null>();
    const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');
    const [currentStepCount, setCurrentStepCount] = useState(0);

    const start = async () => {
        const isAvailable = await Pedometer.isAvailableAsync();
        setIsPedometerAvailable(isAvailable ? 'available' : 'not available');
        if (!isAvailable) {
            return;
        }

        const sub = Pedometer.watchStepCount((result) => {
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
            <Text>Steps count: {currentStepCount}</Text>
        </View>
    );
});
