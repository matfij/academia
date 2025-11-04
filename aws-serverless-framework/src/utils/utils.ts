import { appConfig } from "../definitions/config";

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

export const getS3UploadsPath = (userId: string, name: string) =>
  `${appConfig.s3UploadFolder}/${userId}/${name}.json`;

export const getS3EnhancedPath = (userId: string, name: string) =>
  `${appConfig.s3EnhancedFolder}/${userId}/${name}_enhanced.json`;

export const logAction = (
  status: "INFO" | "SUCCESS" | "ERROR",
  message: string
) => console.log(`${status}: ${message}`);
