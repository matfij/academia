import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { logAction } from "../utils/utils";
import { WorkoutItem } from "../definitions/entities";

export const updateWorkout = async (
  workoutId: string,
  createdAt: number,
  updates: Partial<WorkoutItem>,
  workoutsTable: string,
  dynamoClient: DynamoDBDocumentClient
) => {
  try {
    const { expressions, attributeNames, attributeValues } =
      buildUpdateExpression(updates);

    if (expressions.length === 0) {
      logAction("INFO", `No updates to apply for workout ${workoutId}`);
      return;
    }

    const updateExpression = `SET ${expressions.join(", ")}`;
    
    logAction(
      "INFO",
      `Updating workout ${workoutId} with expression: ${updateExpression}, names: ${JSON.stringify(attributeNames)}, values: ${JSON.stringify(attributeValues)}`
    );

    await dynamoClient.send(
      new UpdateCommand({
        TableName: workoutsTable,
        Key: { workoutId, createdAt },
        UpdateExpression: updateExpression,
        ExpressionAttributeNames: attributeNames,
        ExpressionAttributeValues: attributeValues,
      })
    );

    logAction(
      "SUCCESS",
      `workout ${workoutId} updated: ${JSON.stringify(updates)}`
    );
  } catch (error) {
    logAction("ERROR", `workout update failed: ${error}`);
    throw error; // Re-throw to allow caller to handle
  }
};

const buildUpdateExpression = (updates: Partial<WorkoutItem>) => {
  const expressions: string[] = [];
  const attributeNames: Record<string, string> = {};
  const attributeValues: Record<string, unknown> = {};
  let valueCounter = 0;

  const processField = (value: unknown, nameParts: string[]): void => {
    if (value === undefined || value === null) return;

    if (
      typeof value === "object" &&
      !Array.isArray(value) &&
      value.constructor === Object
    ) {
      // Handle nested objects (e.g., metadata)
      // Check if object has any non-undefined/non-null values
      const hasValidFields = Object.values(value).some(
        (v) => v !== undefined && v !== null
      );
      
      if (!hasValidFields) {
        // Skip empty objects or objects with only undefined/null values
        return;
      }

      for (const [key, val] of Object.entries(value)) {
        processField(val, [...nameParts, key]);
      }
    } else {
      // Leaf value - create expression
      const nameExpr = nameParts.map((p) => `#${p}`).join(".");
      const valueKey = `:val${valueCounter++}`;

      expressions.push(`${nameExpr} = ${valueKey}`);
      nameParts.forEach((p) => {
        attributeNames[`#${p}`] = p;
      });
      attributeValues[valueKey] = value;
    }
  };

  // Filter out undefined/null values from updates before processing
  const filteredUpdates = Object.fromEntries(
    Object.entries(updates).filter(([_, v]) => v !== undefined && v !== null)
  );

  for (const [key, value] of Object.entries(filteredUpdates)) {
    processField(value, [key]);
  }

  return { expressions, attributeNames, attributeValues };
};
