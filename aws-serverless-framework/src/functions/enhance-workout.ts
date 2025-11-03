import { Handler } from "aws-lambda";
import { ValidateWorkoutResult } from "../definitions/dtos";
import { logAction } from "../utils/utils";

export const handler: Handler<ValidateWorkoutResult> = (validationResult) => {
  try {
    logAction(
      "INFO",
      `Started enhance workout: ${JSON.stringify({
        workout: validationResult.workout,
      })}`
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logAction("ERROR", `Workout validation failed: ${errorMessage}`);
  }
};
