import { Account, Client } from "react-native-appwrite";
import { getEnvVar } from "./utils";

export const awClient = new Client()
  .setEndpoint(getEnvVar("EXPO_PUBLIC_APPWRITE_ENDPOINT"))
  .setProject(getEnvVar("EXPO_PUBLIC_APPWRITE_PROJECT_ID"))
  .setPlatform(getEnvVar("EXPO_PUBLIC_APPWRITE_PROJECT_NAME"));

export const awAccount = new Account(awClient);
