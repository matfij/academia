import { Handler } from "aws-lambda";
import { ValidateWorkoutResult } from "../definitions/dtos";
import { getEnvVar, logAction } from "../utils/utils";
import { enhanceWorkoutWithGPT as enhanceWorkout } from "../services/enhance-workout";
import { updateWorkout } from "../services/update-workout";
import { getWorkout } from "../services/get-workout";
import { WorkoutItem } from "../definitions/entities";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { S3Client } from "@aws-sdk/client-s3";
import { uploadToS3 } from "../services/upload-to-s3";
import { BedrockRuntimeClient } from "@aws-sdk/client-bedrock-runtime";

const awsRegion = getEnvVar("AWS_REGION");
const workoutsTable = getEnvVar("WORKOUTS_TABLE");
const workoutsBucket = getEnvVar("WORKOUTS_BUCKET");

const dynamoRawClient = new DynamoDBClient({ region: awsRegion });
const dynamoClient = DynamoDBDocumentClient.from(dynamoRawClient, {
  marshallOptions: { removeUndefinedValues: true, convertEmptyValues: false },
});
const s3Client = new S3Client({ region: awsRegion });
const bedrockClient = new BedrockRuntimeClient({ region: awsRegion });

export const handler: Handler<ValidateWorkoutResult> = async (
  validationResult
) => {
  try {
    logAction(
      "INFO",
      `Started enhance workout: ${JSON.stringify({
        workout: validationResult.workout,
      })}`
    );

    const workout = (await getWorkout(
      validationResult.workoutId,
      workoutsTable,
      dynamoClient
    )) as WorkoutItem;

    await updateWorkout(
      { ...workout, status: "enhancing" },
      workoutsTable,
      dynamoClient
    );

    const enhancedWorkout = await enhanceWorkout(
      validationResult.workout,
      validationResult.enhancePrompt,
      bedrockClient
    );

    const s3Key = `enhanced/${validationResult.userId}/${validationResult.workoutId}/enhanced.json`;
    await uploadToS3(enhancedWorkout, s3Key, workoutsBucket, s3Client);

    await updateWorkout(
      { ...workout, status: "completed", enhancedS3Key: s3Key },
      workoutsTable,
      dynamoClient
    );

    logAction("SUCCESS", `Workout enhanced successfully: ${s3Key}`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logAction("ERROR", `Workout validation failed: ${errorMessage}`);
    throw error;
  }
};
