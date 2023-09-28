import { APIGatewayProxyEvent } from 'aws-lambda';
import { PutItemCommand } from '@aws-sdk/client-dynamodb';
import { dbClient } from '../spaces-handler';
import { isValidSpace } from '../common/validator';
import { marshall } from '@aws-sdk/util-dynamodb';
import { generateUUID, parseJSON } from '../common/utils';

export const createSpace = async (event: APIGatewayProxyEvent): Promise<string> => {
    const spacePayload = parseJSON(event.body);
    spacePayload.id = generateUUID();
    isValidSpace(spacePayload);
    const space = await dbClient.send(
        new PutItemCommand({
            TableName: process.env.TABLE_NAME,
            Item: marshall(spacePayload),
        }),
    );
    return JSON.stringify(space);
};
