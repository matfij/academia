import { S3Handler } from "aws-lambda";
import { SFNClient, StartExecutionCommand } from "@aws-sdk/client-sfn";
import { getEnvVar, logAction } from "../utils/utils";
import { EnhanceWorkoutRequest } from "../definitions/dtos";

const sfnArn = getEnvVar("STATE_MACHINE_ARN");

const sfnClient = new SFNClient({ region: process.env.AWS_REGION });

export const handler: S3Handler = async (event) => {
  try {
    logAction(
      "INFO",
      `Start consultant started: ${JSON.stringify({ records: event.Records })}`
    );

    const consultantTasks = event.Records.map(async (record) => {
      const bucket = record.s3.bucket.name;
      const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, " "));

      logAction(
        "INFO",
        `Processing task: ${JSON.stringify({ record, bucket, key })}`
      );

      const keyParts = key.split("/");
      if (keyParts.length < 0 || keyParts[0] !== "uploads") {
        console.log("Invalid S3 ket format:", key);
        return;
      }

      const [, userId, workoutId] = keyParts;

      const sfnInput: EnhanceWorkoutRequest = {
        workoutId,
        userId,
        s3Key: key,
        s3Bucket: bucket,
      };

      const command = new StartExecutionCommand({
        stateMachineArn: sfnArn,
        name: `consult-${workoutId}-${Date.now()}`,
        input: JSON.stringify(sfnInput),
      });

      const result = await sfnClient.send(command);

      logAction(
        "SUCCESS",
        `Starting Step Function execution: ${JSON.stringify({
          stateMachineArn: sfnArn,
          input: sfnInput,
          executionArn: result.executionArn,
          workoutId,
        })}`
      );

      return result;
    });

    await Promise.all(consultantTasks);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logAction(
      "ERROR",
      `Starting Step Function execution failed: ${errorMessage}`
    );
  }
};
