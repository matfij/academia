import { Account, Client, TablesDB } from "react-native-appwrite";
import { getEnvVar } from "./utils";

export const awClient = new Client()
  .setEndpoint(getEnvVar("APPWRITE_ENDPOINT"))
  .setProject(getEnvVar("APPWRITE_PROJECT_ID"))
  .setPlatform(getEnvVar("APPWRITE_PROJECT_NAME"));

export const awAccount = new Account(awClient);

export const awDatabase = new TablesDB(awClient);
