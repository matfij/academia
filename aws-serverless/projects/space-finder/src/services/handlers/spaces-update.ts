import { APIGatewayProxyEvent } from 'aws-lambda';
import { dbClient } from '../spaces-handler';
import { UpdateItemCommand } from '@aws-sdk/client-dynamodb';

export const updateSpace = async (event: APIGatewayProxyEvent): Promise<string> => {
    if (!event.queryStringParameters || !('id' in event.queryStringParameters)) {
        throw new Error('Space ID required');
    }
    if (!event.body) {
        throw new Error('Space location required');
    }
    const spaceId = event.queryStringParameters['id'];
    const newLocation = JSON.parse(event.body)['location'];
    const updateResult = await dbClient.send(
        new UpdateItemCommand({
            TableName: process.env.TABLE_NAME,
            Key: {
                id: { S: spaceId },
            },
            UpdateExpression: 'set #xdNew = :new',
            ExpressionAttributeValues: {
                ':new': {
                    S: newLocation,
                },
            },
            ExpressionAttributeNames: {
                '#xdNew': 'location',
            },
            ReturnValues: 'UPDATED_NEW',
        }),
    );
    return JSON.stringify(updateResult.Attributes);
};
