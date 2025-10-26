import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

const dynamoClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const scanTable = async <T>(table: string) => {
  const command = new ScanCommand({ TableName: table });
  const result = await dynamoClient.send(command);
  return (result.Items || []).map((item) => unmarshall(item) as T);
};

export const getEnvVar = <T>(name: string) => {
  return process.env[name] as T;
};
