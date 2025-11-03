import { ValidationDetail } from "../definitions/dtos";
import { WorkoutPlan } from "../definitions/types";
import { validation } from "../definitions/config";

export const validateWorkout = (workout: WorkoutPlan): ValidationDetail[] => {
  const errors: ValidationDetail[] = [];

  if (!workout.exercises || !Array.isArray(workout.exercises)) {
    errors.push({
      field: "exercises",
      error: "Workout must contain an exercises array",
    });
    return errors;
  }

  const exerciseCount = workout.exercises.length;
  if (exerciseCount < validation.minExercises) {
    errors.push({
      field: "exercises",
      error: `Workout must have at least ${validation.minExercises} exercise(s), found ${exerciseCount}`,
    });
  }
  if (exerciseCount > validation.maxExercises) {
    errors.push({
      field: "exercises",
      error: `Workout must have at most ${validation.maxExercises} exercise(s), found ${exerciseCount}`,
    });
  }

  workout.exercises.forEach((exercise, index) => {
    const exercisePrefix = `exercises[${index}]`;

    if (
      exercise.sets < validation.minSets ||
      exercise.sets > validation.maxSets
    ) {
      errors.push({
        field: `${exercisePrefix}.sets`,
        error: `Sets must be between ${validation.minSets} and ${validation.maxSets}, found ${exercise.sets}`,
      });
    }

    if (
      exercise.reps < validation.minReps ||
      exercise.reps > validation.maxReps
    ) {
      errors.push({
        field: `${exercisePrefix}.reps`,
        error: `Reps must be between ${validation.minReps} and ${validation.maxReps}, found ${exercise.reps}`,
      });
    }

    if (exercise.weight !== "body") {
      const weight =
        typeof exercise.weight === "number"
          ? exercise.weight
          : parseFloat(String(exercise.weight));
      if (
        isNaN(weight) ||
        weight < validation.minWeight ||
        weight > validation.maxWeight
      ) {
        errors.push({
          field: `${exercisePrefix}.weight`,
          error: `Weight must be "body" or a number between ${validation.minWeight} and ${validation.maxWeight}, found ${exercise.weight}`,
        });
      }
    }

    if (
      exercise.restTime < validation.minRestTime ||
      exercise.restTime > validation.maxRestTime
    ) {
      errors.push({
        field: `${exercisePrefix}.restTime`,
        error: `Rest time must be between ${validation.minRestTime} and ${validation.maxRestTime} seconds, found ${exercise.restTime}`,
      });
    }

    if (exercise.notes !== undefined) {
      const notesLength = exercise.notes.length;
      if (
        notesLength < validation.minNotesLength ||
        notesLength > validation.maxNotesLength
      ) {
        errors.push({
          field: `${exercisePrefix}.notes`,
          error: `Notes length must be between ${validation.minNotesLength} and ${validation.maxNotesLength} characters, found ${notesLength}`,
        });
      }
    }

    if (!exercise.name || exercise.name.trim().length === 0) {
      errors.push({
        field: `${exercisePrefix}.name`,
        error: "Exercise name is required",
      });
    }
  });

  if (workout.totalDuration === undefined || workout.totalDuration === null) {
    errors.push({
      field: "totalDuration",
      error: "Total duration is required",
    });
  }

  if (
    !workout.focus ||
    !["strength", "hypertrophy", "endurance"].includes(workout.focus)
  ) {
    errors.push({
      field: "focus",
      error: 'Focus must be one of: "strength", "hypertrophy", or "endurance"',
    });
  }

  return errors;
};
