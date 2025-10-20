import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export const echo = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const body = {
    message: `Request context: ${JSON.stringify(
      event.requestContext,
      null,
      2
    )}`,
  };

  return {
    statusCode: 200,
    body: JSON.stringify(body),
  };
};
