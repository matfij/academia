import { APIGatewayProxyEvent } from 'aws-lambda';
import { GetItemCommand, ScanCommand } from '@aws-sdk/client-dynamodb';
import { dbClient } from '../spaces-handler';

export const readSpaces = async (event: APIGatewayProxyEvent): Promise<string> => {
    if (event.queryStringParameters && 'id' in event.queryStringParameters) {
        const spaceId = event.queryStringParameters['id'];
        const spaceResponse = await dbClient.send(
            new GetItemCommand({
                TableName: process.env.TABLE_NAME,
                Key: {
                    id: { S: spaceId },
                },
            }),
        );
        if (!spaceResponse.Item) {
            throw new Error('Item not found');
        }
        return JSON.stringify(spaceResponse.Item);
    }
    const spacesResponse = await dbClient.send(
        new ScanCommand({
            TableName: process.env.TABLE_NAME,
        }),
    );
    return JSON.stringify(spacesResponse.Items);
};
