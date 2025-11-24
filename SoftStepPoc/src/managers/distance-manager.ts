type Point = {
    latitude: number;
    longitude: number;
};

const EARTH_RADIUS_M = 6_371_000;

export const calculateRouteLength = (points: Point[]): number => {
    let total = 0;

    for (let i = 1; i < points.length; i++) {
        total += calculateDistanceBetweenPoints(points[i - 1], points[i]);
    }

    return total;
};

const calculateDistanceBetweenPoints = (a: Point, b: Point): number => {
    const aLat = degToRad(a.latitude);
    const bLat = degToRad(b.latitude);
    const latDiff = bLat - aLat;
    const lngDiff = degToRad(b.longitude - a.longitude);

    const sinLat = Math.sin(latDiff / 2);
    const sinLng = Math.sin(lngDiff / 2);

    const haversine = sinLat * sinLat + Math.cos(aLat) * Math.cos(bLat) * sinLng * sinLng;

    return 2 * EARTH_RADIUS_M * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
};

const degToRad = (deg: number) => (deg * Math.PI) / 180;
