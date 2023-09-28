import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { createSpace } from './handlers/spaces-create';
import { deleteSpace } from './handlers/spaces-delete';
import { readSpaces } from './handlers/spaces-read';
import { updateSpace } from './handlers/spaces-update';
import { MissingFieldError, ParsingError } from './common/errors';

export const dbClient = DynamoDBDocumentClient.from(new DynamoDBClient());

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
    let data: string;
    try {
        switch (event.httpMethod) {
            case 'GET': {
                data = await readSpaces(event);
                break;
            }
            case 'POST': {
                data = await createSpace(event);
                break;
            }
            case 'PUT': {
                data = await updateSpace(event);
                break;
            }
            case 'DELETE': {
                data = await deleteSpace(event);
                break;
            }
            default: {
                data = 'METOD NOT FOUND';
            }
        }
    } catch (err) {
        if (err instanceof MissingFieldError) {
            return {
                statusCode: 400,
                body: err.message,
            };
        }
        if (err instanceof ParsingError) {
            return {
                statusCode: 400,
                body: err.message,
            };
        }
        return {
            statusCode: 500,
            body: JSON.stringify(err),
        };
    }
    return {
        statusCode: 200,
        body: data,
    };
}

export { handler };
