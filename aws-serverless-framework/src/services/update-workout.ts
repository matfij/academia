import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { getDynamoWorkoutItemTTL, logAction } from "../utils/utils";
import { WorkoutItem } from "../definitions/entities";

export const updateWorkout = async (
  workout: WorkoutItem,
  workoutsTable: string,
  dynamoClient: DynamoDBDocumentClient
) => {
  try {
    logAction(
      "INFO",
      `Updating workout ${workout.workoutId} with: ${JSON.stringify({
        workout,
      })}`
    );

    const putWorkoutCommand = new PutCommand({
      TableName: workoutsTable,
      Item: {
        ...workout,
        ttl: getDynamoWorkoutItemTTL(),
      },
    });

    await dynamoClient.send(putWorkoutCommand);

    logAction("SUCCESS", `workout ${workout.workoutId} updated`);
  } catch (error) {
    logAction("ERROR", `workout update failed: ${error}`);
    throw error; // Re-throw to allow caller to handle
  }
};
