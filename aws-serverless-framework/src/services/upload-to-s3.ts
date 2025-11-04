import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { logAction } from "../utils/utils";

export const uploadToS3 = async (
  item: unknown,
  s3Key: string,
  s3Bucket: string,
  s3Client: S3Client
) => {
  try {
    logAction("INFO", `Uploading item to S3: ${s3Key}`);
    const command = new PutObjectCommand({
      Bucket: s3Bucket,
      Key: s3Key,
      Body: JSON.stringify(item),
    });
    await s3Client.send(command);
    logAction("SUCCESS", `Uploaded item to S3: ${s3Key}`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logAction("ERROR", `Failed to upload item ${s3Key} to S3: ${errorMessage}`);
    throw new Error(`Failed to upload item to S3: ${s3Key}`);
  }
};
