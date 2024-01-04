import { Point } from './types';

export const uuid = () => {
    return `${Math.random().toString(36).substring(2)}-${Math.random()
        .toString(36)
        .substring(2)}-${Math.random().toString(36).substring(2)}`;
};

export const comparePositions = (a: Point, b: Point) => {
    return a.x === b.x && a.y === b.y;
};

export const createMarkup = (markup: string) => {
    return { __html: markup };
};
