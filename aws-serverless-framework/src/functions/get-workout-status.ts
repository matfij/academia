import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import {
  formatErrorResponse,
  formatSuccessResponse,
} from "../utils/format-response";
import { getEnvVar, logAction } from "../utils/utils";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getWorkout } from "../services/get-workout";
import { appConfig } from "../definitions/config";

const awsRegion = getEnvVar("AWS_REGION");
const workoutsTable = getEnvVar("WORKOUTS_TABLE");
const workoutsBucket = getEnvVar("WORKOUTS_BUCKET");

const dynamoRawClient = new DynamoDBClient({ region: awsRegion });
const dynamoClient = DynamoDBDocumentClient.from(dynamoRawClient, {
  marshallOptions: { removeUndefinedValues: true, convertEmptyValues: false },
});
const s3Client = new S3Client({ region: awsRegion });

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    logAction("INFO", "Getting workout status");

    const workoutId = event.pathParameters?.["workoutId"];
    if (!workoutId) {
      return formatErrorResponse("Missing workoutId path parameter", 400);
    }

    const workout = await getWorkout(workoutId, workoutsTable, dynamoClient);
    if (!workout) {
      return formatErrorResponse("Workout not found", 400);
    }

    let downloadUrl: string | undefined;
    if (workout.status === "completed" && workout.enhancedS3Key) {
      const command = new GetObjectCommand({
        Bucket: workoutsBucket,
        Key: workout.enhancedS3Key,
      });
      downloadUrl = await getSignedUrl(s3Client, command, {
        expiresIn: appConfig.presignedURLTTL,
      });
      logAction("INFO", `Generated presigned URL for workout ${workoutId}`);
    }

    logAction("SUCCESS", `Workout status: ${workout.status}`);

    return formatSuccessResponse({
      status: workout.status,
      ...(downloadUrl && { downloadUrl }),
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logAction("ERROR", `Get workout status failed: ${errorMessage}`);
    return formatErrorResponse("Unable to get workout status");
  }
};
