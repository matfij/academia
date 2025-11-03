export const getEnvVar = <T = string>(
  name:
    | "AWS_REGION"
    | "WORKOUTS_BUCKET"
    | "WORKOUTS_TABLE"
    | "STATE_MACHINE_ARN"
    | "OPENAI_API_KEY"
) => process.env[name] as T;

export const parseRequestBody = <T>(body: string | null): T | null => {
  if (!body) {
    return null;
  }
  try {
    return JSON.parse(body) as T;
  } catch {
    return null;
  }
};

export const getDynamoWorkoutItemTTL = () =>
  Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60;

export const logAction = (
  status: "INFO" | "SUCCESS" | "ERROR",
  message: string
) => console.log(`${status}: ${message}`);
