export const getEnvVar = <T>(
  name: "AWS_REGION" | "WORKOUTS_BUCKET" | "WORKOUTS_TABLE"
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
