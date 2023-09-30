import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { ParsingError } from './errors';
import { randomUUID } from 'crypto';

export const parseJSON = (data: string) => {
    try {
        return JSON.parse(data);
    } catch (err) {
        throw new ParsingError(data);
    }
};

// under the hood v4() calls randomUUID() which makes cdk boundle larger
export const generateUUID = () => randomUUID();

export const isAdmin = (event: APIGatewayProxyEvent) => {
    const groups = event.requestContext.authorizer.claims['cognito:groups'];
    if (!groups) {
        return false;
    }
    return (groups as string).includes('admins');
};

export function cors(target: any, key: string, descriptor: PropertyDescriptor) {
    const functionRef = descriptor.value;
    descriptor.value = async function (...args) {
        const res = await functionRef.apply(this, args);
        console.log('res', res)
        return {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': '*',
            },
            ...res,
        };
    };
    return descriptor.value;
};
