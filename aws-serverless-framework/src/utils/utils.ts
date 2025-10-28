export const getEnvVar = <T>(
  name: "AWS_REGION" | "WORKOUTS_BUCKET" | "WORKOUT_TABLE"
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
