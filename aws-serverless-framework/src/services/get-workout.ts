import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
import { logAction } from "../utils/utils";
import { WorkoutItem } from "../definitions/entities";

export const getWorkout = async (
  workoutId: string,
  workoutsTable: string,
  dynamoClient: DynamoDBDocumentClient
): Promise<WorkoutItem | null> => {
  try {
    logAction("INFO", `Fetching workout ${workoutId}`);

    const result = await dynamoClient.send(
      new GetCommand({
        TableName: workoutsTable,
        Key: {
          workoutId,
        },
      })
    );

    if (!result.Item) {
      logAction("INFO", `Workout ${workoutId} not found`);
      return null;
    }

    logAction("SUCCESS", `Workout ${workoutId} retrieved successfully`);

    return result.Item as WorkoutItem;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logAction("ERROR", `Failed to get workout ${workoutId}: ${errorMessage}`);
    throw error;
  }
};
