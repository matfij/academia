import { ID } from "react-native-appwrite";

export const getEnvVar = <T = string>(
  name:
    | "EXPO_PUBLIC_APPWRITE_ENDPOINT"
    | "EXPO_PUBLIC_APPWRITE_PROJECT_NAME"
    | "EXPO_PUBLIC_APPWRITE_PROJECT_ID"
    | "EXPO_PUBLIC_APPWRITE_DATABASE_ID"
    | "EXPO_PUBLIC_APPWRITE_DATABASE_HABITS_TABLE_ID"
) => process.env[name] as T;

export const generateId = () => ID.unique();
