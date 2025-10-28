import { APIGatewayProxyResult } from "aws-lambda";

interface ResponseOptions {
  statusCode?: number;
  headers?: Record<string, string>;
}

export const formatResponse = (
  body: unknown,
  options: ResponseOptions
): APIGatewayProxyResult => {
  const { statusCode = 200, headers = {} } = options;

  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Allow-Headers": "Content-Type,Authorization",
      "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
      ...headers,
    },
    body: JSON.stringify(body),
  };
};

export const formatSuccessResponse = (
  data: unknown,
  statusCode = 200
): APIGatewayProxyResult =>
  formatResponse({ success: true, data }, { statusCode });

export const formatErrorResponse = (
  message: string,
  statusCode = 500,
  details?: Record<string, string>
): APIGatewayProxyResult => {
  return formatResponse(
    {
      success: false,
      error: {
        message,
        ...(details && { details }),
      },
    },
    { statusCode }
  );
};
