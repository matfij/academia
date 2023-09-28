import { APIGatewayProxyEvent } from 'aws-lambda';
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
