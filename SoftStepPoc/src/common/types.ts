import { ReactNode } from 'react';

export type ComponentProps = {
    children: ReactNode;
};

export type Point = {
    latitude: number;
    longitude: number;
};

export type ActivityReport = {
    duration: number;
    distance: number;
    averageSpeed: number;
    topSpeed: number;
    route: Point[];
};
