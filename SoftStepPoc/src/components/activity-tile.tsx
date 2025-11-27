import { Text, View } from 'react-native';
import MapView, { Marker, Polyline, Region } from 'react-native-maps';
import { Activity } from '../common/types';

export type ActivityTileProps = { activity: Activity };

export const ActivityTile = (props: ActivityTileProps) => {
    const start = props.activity.route[0];
    const finish = props.activity.route[props.activity.route.length - 1];
    const initialRegion = calculateRegion(props.activity.route);

    return (
        <View style={{ borderColor: '#000', borderWidth: 2 }}>
            <Text>{props.activity.title}</Text>
            <MapView initialRegion={initialRegion} style={{ height: 300, width: '100%' }}>
                <Polyline coordinates={props.activity.route} strokeColor="#f12" strokeWidth={3} />
                <Marker coordinate={start} title="Start" pinColor="green" />
                <Marker coordinate={finish} title="Finish" pinColor="red" />
            </MapView>
        </View>
    );
};

const calculateRegion = (route: Activity['route']): Region => {
    let minLat = route[0].latitude;
    let maxLat = route[0].latitude;
    let minLng = route[0].longitude;
    let maxLng = route[0].longitude;

    route.forEach((point) => {
        minLat = Math.min(minLat, point.latitude);
        maxLat = Math.max(maxLat, point.latitude);
        minLng = Math.min(minLng, point.longitude);
        maxLng = Math.max(maxLng, point.longitude);
    });

    return {
        latitude: (minLat + maxLat) / 2,
        longitude: (minLng + maxLng) / 2,
        latitudeDelta: (maxLat - minLat) * 1.2,
        longitudeDelta: (maxLng - minLng) * 1.2,
    };
};
