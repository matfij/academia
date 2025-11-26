import { useEffect, useState } from 'react';
import { Button, Text, View } from 'react-native';
import { ActivityReportModal } from '../../components/activity-report-modal';
import { useActivityTracking } from '../../managers/use-activity-tracking';

export default function HomePage() {
    const { isTracking, distance, speed, activityReport, start, stop, finish } = useActivityTracking();
    const [showReport, setShowReport] = useState(false);

    useEffect(() => {
        if (activityReport) {
            setShowReport(true);
        }
    }, [activityReport]);

    const onCloseReport = () => {
        setShowReport(false);
    };

    return (
        <View
            style={{ height: '100%', justifyContent: 'center', alignItems: 'stretch', padding: 24, gap: 16 }}>
            <Text>Status: {isTracking ? 'Tracking' : 'Not tracking'}</Text>
            <Text>Speed: {speed} (m/m)</Text>
            <Text>Total distance: {distance} (m)</Text>

            <Button title="Start" onPress={start} disabled={isTracking} />
            <Button title="Stop" onPress={stop} disabled={!isTracking} />
            <Button title="Finish" onPress={finish} disabled={!isTracking} />

            {activityReport && (
                <ActivityReportModal
                    visible={showReport}
                    activityReport={activityReport}
                    onClose={onCloseReport}
                />
            )}
        </View>
    );
}
