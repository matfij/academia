import { useEffect } from 'react';
import { Button, Text, View } from 'react-native';
import { useActivityTracking } from '../../managers/use-activity-tracking';

export default function HomePage() {
    const { isTracking, distance, speed, activityReport, start, stop, finish } = useActivityTracking();

    useEffect(() => {
        console.log({ activityReport });
    }, [activityReport]);

    return (
        <View
            style={{ height: '100%', justifyContent: 'center', alignItems: 'stretch', padding: 24, gap: 16 }}>
            <Text>Status: {isTracking ? 'Tracking' : 'Not tracking'}</Text>
            <Text>Speed: {speed} (m/m)</Text>
            <Text>Total distance: {distance} (m)</Text>

            <Button title="Start" onPress={start} disabled={isTracking} />
            <Button title="Stop" onPress={stop} disabled={!isTracking} />
            <Button title="Finish" onPress={finish} disabled={!isTracking} />
        </View>
    );
}
