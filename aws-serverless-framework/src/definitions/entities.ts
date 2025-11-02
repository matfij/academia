export interface WorkoutItem {
  workoutId: string;
  userId: string;
  enhancePrompt: string;
  status:
    | "pending"
    | "validating"
    | "valid"
    | "invalid"
    | "enhancing"
    | "completed"
    | "failed";
  originalS3key: string;
  enhancedS3Key?: string;
  error?: string;
  metadata: {
    originalExerciseCount?: number;
    enhancedExerciseCount?: number;
    llmModel?: string;
    processingDuration?: number;
  };
  ttl?: number;
}
