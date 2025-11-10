import type { ReactNode } from "react";

export interface ComponentProps {
  children: ReactNode;
}

export type HabitFrequency = "Hourly" | "Daily" | "Weekly" | "Monthly";

export interface Habit {
  $id: string;
  $createdAt: string;
  $updatedAt: string;

  userId: string;
  title: string;
  description: string;
  frequency: HabitFrequency;
  streakCount: number;
  lastCompleted: number;
}

export interface HabitInput {
  userId: string;
  title: string;
  description: string;
  frequency: HabitFrequency;
  streakCount: number;
  lastCompleted: number;
}
