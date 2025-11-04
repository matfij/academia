import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { logAction } from "../utils/utils";

export const downloadFromS3 = async (
  bucket: string,
  key: string,
  s3Client: S3Client
): Promise<string> => {
  try {
    logAction("INFO", `Downloading item from S3: ${key}`);
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    });
    const response = await s3Client.send(command);
    const bodyContents = await streamToString(
      response.Body as NodeJS.ReadableStream
    );
    logAction("SUCCESS", `Downloaded item from S3: ${key}`);
    return bodyContents;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logAction(
      "ERROR",
      `Failed to download item ${key} from S3: ${errorMessage}`
    );
    throw new Error(`Failed to download item file: ${key}`);
  }
};

const streamToString = async (
  stream: NodeJS.ReadableStream
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
  });
};
