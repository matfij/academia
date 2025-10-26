export interface Exercise {
  name: string;
  sets: number;
  reps: number;
  weight: "body" | number;
  restTime: number;
  notes?: string;
}

export interface WorkoutPlan {
  exercises: Exercise[];
  totalDuration: number;
  difficulty?: "beginner" | "intermediate" | "advanced";
  focus: "strength" | "hypertrophy" | "endurance";
}

export const validationRules = {
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
};
