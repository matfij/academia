export const getEnvVar = <T = string>(
  name:
    | "EXPO_PUBLIC_APPWRITE_ENDPOINT"
    | "EXPO_PUBLIC_APPWRITE_PROJECT_NAME"
    | "EXPO_PUBLIC_APPWRITE_PROJECT_ID"
) => process.env[name] as T;
