import { ID } from "react-native-appwrite";

export const getEnvVar = <T = string>(
  name:
    | "APPWRITE_ENDPOINT"
    | "APPWRITE_PROJECT_NAME"
    | "APPWRITE_PROJECT_ID"
    | "APPWRITE_DATABASE_ID"
    | "APPWRITE_DATABASE_HABITS_TABLE_ID"
    | "APPWRITE_DATABASE_HABIT_COMPLETIONS_TABLE_ID"
) => process.env["EXPO_PUBLIC_" + name] as T;

export const generateId = () => ID.unique();

export const normalizeDate = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

export const gatDayDifference = (a: Date, b: Date) =>
  Math.abs(
    Math.round(
      (normalizeDate(a).getTime() - normalizeDate(b).getTime()) /
        (1000 * 60 * 60 * 24)
    )
  );
