import { useEffect, useRef } from 'react';
import { Animated, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ActivityReport } from '../common/types';
import { formatDuration } from '../managers/time-manager';

interface ActivityReportModalProps {
    visible: boolean;
    activityReport: ActivityReport;
    onClose: () => void;
}

export const ActivityReportModal = (props: ActivityReportModalProps) => {
    const formattedDuration = formatDuration(props.activityReport.duration);

    return (
        <Modal visible={props.visible} transparent animationType="slide">
            <View style={styles.container}>
                <View style={styles.modal}>
                    <Text style={styles.title}>Activity Finished! 🎉</Text>

                    <View style={styles.content}>
                        <AnimatedStatItem label="Distance" value={`${props.activityReport.distance}m`} />
                        <AnimatedStatItem
                            label="Average Speed"
                            value={`${props.activityReport.averageSpeed.toFixed(2)} m/s`}
                        />
                        <AnimatedStatItem
                            label="Top Speed"
                            value={`${props.activityReport.topSpeed.toFixed(2)} m/s`}
                        />
                        <AnimatedStatItem label="Duration" value={formattedDuration} />
                    </View>

                    <TouchableOpacity style={styles.button} onPress={props.onClose}>
                        <Text style={styles.buttonText}>Done</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

interface AnimatedStatItemProps {
    label: string;
    value: string;
}

const AnimatedStatItem = (props: AnimatedStatItemProps) => {
    const animatedValues = useRef(props.value.split('').map(() => new Animated.Value(0))).current;

    useEffect(() => {
        const animations = animatedValues.map((animValue, index) => {
            const delay = index * 50;
            return Animated.sequence([
                Animated.delay(delay),
                Animated.timing(animValue, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: false,
                }),
            ]);
        });

        Animated.parallel(animations).start();
    }, [props.value, animatedValues]);

    const displayChars = props.value.split('').map((char, index) => {
        const animValue = animatedValues[index];
        const translateY = animValue.interpolate({
            inputRange: [0, 1],
            outputRange: [10, 0],
        });

        const opacity = animValue.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0, 0.5, 1],
        });

        return (
            <Animated.Text
                key={index}
                style={[
                    styles.animatedChar,
                    {
                        transform: [{ translateY }],
                        opacity,
                    },
                ]}>
                {char}
            </Animated.Text>
        );
    });

    return (
        <View style={styles.statItem}>
            <Text style={styles.label}>{props.label}</Text>
            <View style={styles.valueContainer}>{displayChars}</View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modal: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 24,
        width: '80%',
        maxWidth: 400,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: '#333',
    },
    content: {
        marginBottom: 24,
    },
    statItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 12,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    label: {
        fontSize: 16,
        color: '#666',
        fontWeight: '500',
    },
    valueContainer: {
        flexDirection: 'row',
    },
    animatedChar: {
        fontSize: 16,
        color: '#333',
        fontWeight: 'bold',
    },
    button: {
        backgroundColor: '#007AFF',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
