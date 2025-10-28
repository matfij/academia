import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getEnvVar, parseRequestBody } from "../utils/utils";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { APIGatewayProxyHandler } from "aws-lambda";
import {
  formatErrorResponse,
  formatSuccessResponse,
} from "../utils/format-response";
import { UploadUrlRequest } from "../definitions/dtos";
import { randomUUID } from "node:crypto";
import { config } from "../definitions/config";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const awsRegion = getEnvVar<string>("AWS_REGION");
const workoutBucket = getEnvVar<string>("WORKOUTS_BUCKET");
// const workoutTable = getEnvVar<string>("WORKOUT_TABLE");

const s3Client = new S3Client({ region: awsRegion });
// const dynamoClient = new DynamoDBClient({ region: awsRegion });
// const dynamoDocumentClient = DynamoDBDocumentClient.from(dynamoClient);

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const body = parseRequestBody<UploadUrlRequest>(event.body);
    if (!body) {
      return formatErrorResponse("Invalid request body");
    }

    const workoutId = randomUUID();
    const timestamp = Date.now();

    const command = new PutObjectCommand({
      Bucket: workoutBucket,
      Key: `uploads/${body.userId}/${workoutId}/${body.fileName}.json`,
      ContentType: "application/json",
      Metadata: {
        workoutId,
        userId: body.userId,
        enhancePrompt: body.enhancePrompt,
        uploadedAt: timestamp.toString(),
      },
    });

    const uploadUrl = await getSignedUrl(s3Client, command, {
      expiresIn: config.presignedURLTTL,
    });

    return formatSuccessResponse({
      workoutId,
      uploadUrl,
      expiresIn: config.presignedURLTTL,
    });
  } catch (error) {
    return formatErrorResponse(`Unexpected error: ${error}`);
  }
};
