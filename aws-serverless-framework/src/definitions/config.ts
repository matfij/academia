export const appConfig = {
  presignedURLTTL: 300,
  s3UploadFolder: "uploads",
  s3EnhancedFolder: "enhanced",
  itemFormat: "json",
} as const;

export const validation = {
  minSets: 1,
  maxSets: 10,
  minReps: 1,
  maxReps: 100,
  minExercises: 1,
  maxExercises: 20,
  minWeight: 0,
  maxWeight: 1000,
  minRestTime: 0,
  maxRestTime: 600,
  minNotesLength: 0,
  maxNotesLength: 1000,
} as const;
