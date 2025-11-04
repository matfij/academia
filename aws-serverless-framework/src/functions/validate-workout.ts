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
import { getWorkout } from "../services/get-workout";
import { WorkoutItem } from "../definitions/entities";
import { ValidationError } from "../definitions/errors";

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
> = async (input) => {
  try {
    logAction(
      "INFO",
      `Workout validation started: ${JSON.stringify({ input })}`
    );

    const workoutItem = (await getWorkout(
      input.workoutId,
      workoutsTable,
      dynamoClient
    )) as WorkoutItem;

    logAction("INFO", `workoutItem: ${JSON.stringify({ workoutItem })}`);

    await updateWorkout(
      { ...workoutItem, status: "validating" },
      workoutsTable,
      dynamoClient
    );

    const workoutData = await downloadFromS3(
      workoutsBucket,
      input.s3Key,
      s3Client
    );
    const workout = JSON.parse(workoutData) as WorkoutPlan;

    const errors = validateWorkout(workout);
    const isValid = errors.length === 0;

    await updateWorkout(
      {
        ...workoutItem,
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

    if (!isValid) {
      throw new ValidationError(
        `Validation failed: ${errors.length} error(s)`,
        errors
      );
    }

    const result: ValidateWorkoutResult = {
      ...input,
      isValid,
      workout,
      ...(errors.length > 0 && { errors }),
      enhancePrompt: workoutItem.enhancePrompt,
    };

    logAction(
      "SUCCESS",
      `Workout validation completed: ${JSON.stringify({ isValid })}`
    );

    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logAction("ERROR", `Workout validation failed: ${errorMessage}`);
    throw error;
  }
};
