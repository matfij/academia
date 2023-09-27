import { Space } from '../models/space';
import { MissingFieldError } from './errors';

export const isValidSpace = (data: any) => {
    const requiredFields = ['id', 'name', 'location'];
    requiredFields.forEach((field) => {
        if ((data as Space)[field] === undefined) {
            throw new MissingFieldError(field);
        }
    });
};
