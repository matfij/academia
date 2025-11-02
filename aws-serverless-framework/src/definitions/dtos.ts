import type { WorkoutPlan } from "./types";

export interface EnhanceWorkoutRequest {
  workoutId: string;
  userId: string;
  s3Key: string;
  s3Bucket: string;
  timestamp: number;
}

export interface EnhanceWorkoutResult extends EnhanceWorkoutRequest {
  enhancedWorkout: WorkoutPlan;
  reasoning: string;
  llmModel: string;
  tokensUsed?: number;
}

export interface ValidateWorkoutResult extends EnhanceWorkoutRequest {
  isValid: boolean;
  errors?: ValidationError[];
  workout: WorkoutPlan;
}

export interface ValidationError {
  field: string;
  error: string;
}

export interface UploadUrlRequest {
  userId: string;
  fileName: string;
  enhancePrompt: string;
}

export interface UploadUrlResponse {
  workoutId: string;
  uploadUrl: string;
  expiresInSeconds: number;
  fields?: Record<string, string>; // POST presigned URLs
}
