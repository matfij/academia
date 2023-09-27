import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
    let message = '';
    switch (event.httpMethod) {
        case 'GET': {
            message = 'GET request';
            break;
        }
        case 'POST': {
            message = 'POST request';
            break;
        }
        default: {
            message = 'UNKNOWN request';
        }
    }
    return {
        statusCode: 200,
        body: message,
    };
}

export { handler };
