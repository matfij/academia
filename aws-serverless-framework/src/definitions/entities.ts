export interface WorkoutItem {
  workoutId: string; // partition key
  createdAt: number; // sort key
  userId: string;
  status: "pending" | "validating" | "enhancing" | "completed" | "failed";
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
