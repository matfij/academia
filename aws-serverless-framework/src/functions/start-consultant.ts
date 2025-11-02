import { S3Handler } from "aws-lambda";
import { SFNClient, StartExecutionCommand } from "@aws-sdk/client-sfn";
import { getEnvVar } from "../utils/utils";
import { EnhanceWorkoutRequest } from "../definitions/dtos";

const sfnArn = getEnvVar("STATE_MACHINE_ARN");

const sfnClient = new SFNClient({ region: process.env.AWS_REGION });

export const handler: S3Handler = async (event) => {
  try {
    console.log("S3 event received:", JSON.stringify(event, null, 2));

    const consultantTasks = event.Records.map(async (record) => {
      const bucket = record.s3.bucket.name;
      const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, " "));

      console.log("Processing S3 object:", { record, bucket, key });

      const keyParts = key.split("/");
      if (keyParts.length < 0 || keyParts[0] !== "uploads") {
        console.log("Invalid S3 ket format:", key);
        return;
      }

      const [, userId, workoutId] = keyParts;
      //   const metadata = record.s3.object.metadata;

      const sfnInput: EnhanceWorkoutRequest = {
        workoutId,
        userId,
        s3Key: key,
        s3Bucket: bucket,
        timestamp: Date.now(),
        enhancePrompt: "test",
      };

      console.log("Starting Step Function execution:", {
        stateMachineArn: sfnArn,
        input: sfnInput,
      });

      const command = new StartExecutionCommand({
        stateMachineArn: sfnArn,
        name: `consult-${workoutId}-${Date.now()}`,
        input: JSON.stringify(sfnInput),
      });

      const result = await sfnClient.send(command);

      console.log("Step Function started successfully:", {
        executionArn: result.executionArn,
        workoutId,
      });

      return result;
    });

    await Promise.all(consultantTasks);
  } catch (error) {
    console.log(`Unexpected error: ${error}`);
  }
};
