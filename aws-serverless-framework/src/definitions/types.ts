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
