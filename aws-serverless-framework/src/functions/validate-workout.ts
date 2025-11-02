import { Handler } from "aws-lambda";
import {
  EnhanceWorkoutRequest,
  ValidateWorkoutResult,
} from "../definitions/dtos";
import { S3Client } from "@aws-sdk/client-s3";
import { getEnvVar, logAction } from "../utils/utils";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { updateWorkout } from "../services/update-workout";
import { downloadFromS3 } from "../services/download-from-s3";
import { validateWorkout } from "../services/validate-workout";
import { WorkoutPlan } from "../definitions/types";

const awsRegion = getEnvVar("AWS_REGION");
const workoutsTable = getEnvVar("WORKOUTS_TABLE");
const workoutsBucket = getEnvVar("WORKOUTS_BUCKET");

const s3Client = new S3Client({ region: awsRegion });
const dynamoRawClient = new DynamoDBClient({ region: awsRegion });
const dynamoClient = DynamoDBDocumentClient.from(dynamoRawClient, {
  marshallOptions: { removeUndefinedValues: true, convertEmptyValues: false },
});

export const handler: Handler<
  EnhanceWorkoutRequest,
  ValidateWorkoutResult
> = async (request) => {
  try {
    logAction(
      "INFO",
      `Workout validation started: ${JSON.stringify({ request })}`
    );

    await updateWorkout(
      request.workoutId,
      request.timestamp,
      { status: "validating" },
      workoutsTable,
      dynamoClient
    );

    const workoutData = await downloadFromS3(
      workoutsBucket,
      request.s3Key,
      s3Client
    );
    const workout = JSON.parse(workoutData) as WorkoutPlan;

    const errors = validateWorkout(workout);
    const isValid = errors.length === 0;

    await updateWorkout(
      request.workoutId,
      request.timestamp,
      {
        status: isValid ? "valid" : "invalid",
        ...(errors.length > 0 && {
          error: `Validation failed: ${errors.length} error(s)`,
          metadata: {
            originalExerciseCount: workout.exercises?.length,
          },
        }),
      },
      workoutsTable,
      dynamoClient
    );

    const result: ValidateWorkoutResult = {
      ...request,
      isValid,
      workout,
      ...(errors.length > 0 && { errors }),
    };

    logAction(
      "SUCCESS",
      `Workout validation completed: ${JSON.stringify({ isValid })}`
    );

    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);

    await updateWorkout(
      request.workoutId,
      request.timestamp,
      {
        status: "failed",
        error: errorMessage,
      },
      workoutsTable,
      dynamoClient
    );

    const errorResult: ValidateWorkoutResult = {
      ...request,
      isValid: false,
      errors: [{ field: "general", error: errorMessage }],
      workout: {} as WorkoutPlan,
    };

    logAction("ERROR", `Workout validation failed: ${errorMessage}`);

    return errorResult;
  }
};
