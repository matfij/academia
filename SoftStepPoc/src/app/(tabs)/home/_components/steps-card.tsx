import { Accelerometer } from 'expo-sensors';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { Text, View } from 'react-native';

const STEP_THRESHOLD = 1.2; // required acceleration magnitude
const STEP_COOLDOWN_MS = 250; // minimum time between steps

export interface StepsCardHandle {
    start: () => Promise<void>;
    stop: () => Promise<void>;
}

export const StepsCard = forwardRef<StepsCardHandle>(function StepsCard(props, ref) {
    const [isTracking, setIsTracking] = useState(false);
    const [currentStepCount, setCurrentStepCount] = useState(0);

    const accelerometerSub = useRef<ReturnType<typeof Accelerometer.addListener> | null>(null);
    const lastMagnitude = useRef(0);
    const lastStepTime = useRef(0);
    const stepCount = useRef(0);

    const start = async () => {
        const isAvailable = await Accelerometer.isAvailableAsync();
        if (!isAvailable) {
            console.log('Accelerometer not present');
            return;
        }

        stepCount.current = 0;
        lastMagnitude.current = 0;
        lastStepTime.current = 0;
        setCurrentStepCount(0);
        setIsTracking(true);

        Accelerometer.setUpdateInterval(25);

        accelerometerSub.current = Accelerometer.addListener(({ x, y, z }) => {
            const magnitude = Math.sqrt(x * x + y * y + z * z);
            const now = Date.now();
            const last = now - lastStepTime.current;

            if (
                magnitude > STEP_THRESHOLD &&
                lastMagnitude.current <= STEP_THRESHOLD &&
                last > STEP_COOLDOWN_MS
            ) {
                stepCount.current += 1;
                lastStepTime.current = now;
                setCurrentStepCount(stepCount.current);
            }

            lastMagnitude.current = magnitude;
        });
    };

    const stop = async () => {
        if (accelerometerSub.current) {
            accelerometerSub.current.remove();
            accelerometerSub.current = null;
        }
        setIsTracking(false);
    };

    useImperativeHandle(ref, () => ({ start, stop }), []);

    return (
        <View>
            <Text>Step counter: {isTracking ? 'Active' : 'Inactive'}</Text>
            <Text>Steps: {currentStepCount}</Text>
        </View>
    );
});
