import type { ReactNode } from "react";
import type { Models } from "react-native-appwrite";

export type xD = any;

export interface ComponentProps {
  children: ReactNode;
}

export type HabitFrequency = "Hourly" | "Daily" | "Weekly" | "Monthly";

export interface Habit extends Models.Row, HabitInput {}

export interface HabitInput {
  userId: string;
  title: string;
  description: string;
  frequency: HabitFrequency;
  streakCount: number;
  lastCompleted: number;
}

export interface HabitCompletion extends Models.Row, HabitCompletionInput {}

export interface HabitCompletionInput {
  userId: string;
  habitId: string;
}
