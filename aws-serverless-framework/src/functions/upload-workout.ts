import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import {
  getDynamoWorkoutItemTTL,
  getEnvVar,
  logAction,
  parseRequestBody,
} from "../utils/utils";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { APIGatewayProxyHandler } from "aws-lambda";
import {
  formatErrorResponse,
  formatSuccessResponse,
} from "../utils/format-response";
import { UploadUrlRequest } from "../definitions/dtos";
import { randomUUID } from "node:crypto";
import { config } from "../definitions/config";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { WorkoutItem } from "../definitions/entities";

const awsRegion = getEnvVar("AWS_REGION");
const workoutBucket = getEnvVar("WORKOUTS_BUCKET");
const workoutTable = getEnvVar("WORKOUTS_TABLE");

const s3Client = new S3Client({ region: awsRegion });
const dynamoRawClient = new DynamoDBClient({ region: awsRegion });
const dynamoClient = DynamoDBDocumentClient.from(dynamoRawClient);

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    logAction(
      "INFO",
      `Workout upload started ${JSON.stringify({ eventBody: event.body })}`
    );

    const body = parseRequestBody<UploadUrlRequest>(event.body);
    if (!body) {
      return formatErrorResponse("Invalid request body");
    }

    const workoutId = randomUUID();
    const s3Key = `uploads/${body.userId}/${workoutId}/${body.fileName}.json`;

    const command = new PutObjectCommand({
      Bucket: workoutBucket,
      Key: s3Key,
      ContentType: "application/json",
      Metadata: {
        workoutId,
        userId: body.userId,
        enhancePrompt: body.enhancePrompt,
        uploadedAt: Date.now().toString(),
      },
    });

    const uploadUrl = await getSignedUrl(s3Client, command, {
      expiresIn: config.presignedURLTTL,
    });

    const putWorkoutCommand = new PutCommand({
      TableName: workoutTable,
      Item: {
        workoutId,
        userId: body.userId,
        enhancePrompt: body.enhancePrompt,
        status: "pending",
        originalS3key: s3Key,
        metadata: {},
        ttl: getDynamoWorkoutItemTTL(),
      } as WorkoutItem,
    });

    await dynamoClient.send(putWorkoutCommand);

    logAction(
      "SUCCESS",
      `Workout upload request completed: ${JSON.stringify({ uploadUrl })}`
    );

    return formatSuccessResponse({
      workoutId,
      uploadUrl,
      expiresIn: config.presignedURLTTL,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logAction("ERROR", `Workout upload failed: ${errorMessage}`);
    return formatErrorResponse(`Workout upload failed`);
  }
};
