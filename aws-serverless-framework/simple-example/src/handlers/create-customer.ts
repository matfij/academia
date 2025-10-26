import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { CustomerInput } from "../definitions/types";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

const dynamoClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const createCustomer = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Invalid request body" }),
      };
    }

    const bodyString = event.isBase64Encoded
      ? Buffer.from(event.body, "base64").toString()
      : event.body;

    const input = JSON.parse(bodyString) as CustomerInput;

    const putCommand = new PutCommand({
      TableName: process.env.DYNAMODB_CUSTOMER_TABLE,
      Item: {
        primary_key: input.name,
        email: input.email,
      },
    });

    await dynamoClient.send(putCommand);

    return {
      statusCode: 201,
      body: JSON.stringify({ message: `${input.name} created` }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: `Internal server error: ${err}`,
      }),
    };
  }
};
