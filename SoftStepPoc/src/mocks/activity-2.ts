import { Activity } from '../common/types';

export const mockActivityReport2: Activity = {
    title: 'My easy jogg',
    duration: 600, // 10 minutes (600 seconds)
    distance: 1247.3, // meters (1.25 km)
    averageSpeed: 124.73, // m/min (7.5 km/h - brisk walking pace)
    topSpeed: 210, // m/min (12.6 km/h - light jogging)
    route: [
        { latitude: 37.422, longitude: -122.0841 },
        { latitude: 37.4225, longitude: -122.0845 },
        { latitude: 37.423, longitude: -122.0848 },
        { latitude: 37.4235, longitude: -122.085 },
        { latitude: 37.424, longitude: -122.0848 },
        { latitude: 37.4243, longitude: -122.0843 },
        { latitude: 37.4245, longitude: -122.0837 },
        { latitude: 37.4246, longitude: -122.083 },
        { latitude: 37.4245, longitude: -122.0825 },
        { latitude: 37.4242, longitude: -122.0823 },
        { latitude: 37.4238, longitude: -122.0824 },
        { latitude: 37.4233, longitude: -122.0828 },
        { latitude: 37.4228, longitude: -122.0833 },
    ],
};
