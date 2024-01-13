import { Level } from '../types';

export const ALL_LEVELS: Level[] = [
    { level: 1, experienceRequired: 0 },
    { level: 2, experienceRequired: 100 },
    { level: 3, experienceRequired: 250 },
    { level: 4, experienceRequired: 400 },
    { level: 5, experienceRequired: 600 },
    { level: 6, experienceRequired: 900 },
    { level: 7, experienceRequired: 1300 },
    { level: 8, experienceRequired: 1800 },
    { level: 9, experienceRequired: 2400 },
    { level: 10, experienceRequired: 3200 },
];
Object.freeze(ALL_LEVELS);

export const getLevel = ({ experience }: { experience: number }) => {
    const level = [...ALL_LEVELS].reverse().find((L) => L.experienceRequired <= experience) || ALL_LEVELS[0];
    return { ...level };
};
