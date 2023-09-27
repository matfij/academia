import { DeleteItemCommand } from '@aws-sdk/client-dynamodb';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { dbClient } from '../spaces-handler';

export const deleteSpace = async (event: APIGatewayProxyEvent): Promise<string> => {
    if (!event.queryStringParameters || !('id' in event.queryStringParameters)) {
        throw new Error('Space ID required');
    }
    const spaceId = event.queryStringParameters['id'];
    const deleteResult = await dbClient.send(
        new DeleteItemCommand({
            TableName: process.env.TABLE_NAME,
            Key: {
                id: { S: spaceId },
            },
        }),
    );
    return spaceId;
};
