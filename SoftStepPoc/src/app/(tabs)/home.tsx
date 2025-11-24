import { Button, Text, View } from 'react-native';
import { useActivityTracking } from '../../managers/use-activity-tracking';

export default function HomePage() {
    const { isTracking, distance, start, stop } = useActivityTracking();

    const onStart = async () => {
        await start();
    };

    const onStop = async () => {
        await stop();
    };

    return (
        <View
            style={{ height: '100%', justifyContent: 'center', alignItems: 'stretch', padding: 24, gap: 16 }}>
            <Text>Status: {isTracking ? 'Tracking' : 'Not tracking'}</Text>
            <Text>Total distance: {distance}m</Text>

            <Button title="Start" onPress={onStart} disabled={isTracking} />
            <Button title="Stop" onPress={onStop} disabled={!isTracking} />
        </View>
    );
}
