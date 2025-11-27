import { useEffect, useState } from 'react';
import { Button, ScrollView, Text, View } from 'react-native';
import { ActivityReportModal } from '../../components/activity-report-modal';
import { ActivityTile } from '../../components/activity-tile';
import { useActivityTracking } from '../../managers/use-activity-tracking';
import { mockActivityReport2 } from '../../mocks/activity-2';

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

            <ScrollView>
                {true && <ActivityTile activity={mockActivityReport2} />}
                {true && <ActivityTile activity={mockActivityReport2} />}
            </ScrollView>
        </View>
    );
}
