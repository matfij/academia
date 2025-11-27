import { ReactNode } from 'react';

export type ComponentProps = {
    children: ReactNode;
};

export type Coordinate = {
    latitude: number;
    longitude: number;
};

export type ActivityReport = {
    duration: number;
    distance: number;
    averageSpeed: number;
    topSpeed: number;
    route: Coordinate[];
};

export type Activity = {
    title: string;
    duration: number;
    distance: number;
    averageSpeed: number;
    topSpeed: number;
    route: Coordinate[];
};
