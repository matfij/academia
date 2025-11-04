import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";
import { WorkoutPlan } from "../definitions/types";
import { logAction } from "../utils/utils";

const maxTokens = 4096;
const bedrockModel = "anthropic.claude-3-5-sonnet-20240620-v1:0";
const modelTemperature = 0.7;

export const enhanceWorkout = async (
  workout: WorkoutPlan,
  enhancePrompt: string,
  bedrockClient: BedrockRuntimeClient
): Promise<WorkoutPlan> => {
  try {
    logAction("INFO", `Enhancing workout with prompt: ${enhancePrompt}`);

    const { systemPrompt, userPrompt } = formatInputPrompt(
      workout,
      enhancePrompt
    );

    const payload = {
      anthropic_version: "bedrock-2023-05-31",
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
      temperature: modelTemperature,
    };

    const response = await bedrockClient.send(
      new InvokeModelCommand({
        modelId: bedrockModel,
        contentType: "application/json",
        accept: "application/json",
        body: JSON.stringify(payload),
      })
    );

    const enhancedWorkout = parseModelResponse(response.body);

    logAction(
      "SUCCESS",
      `Enhancing complete: ${JSON.stringify({ enhancedWorkout })}`
    );

    return enhancedWorkout;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logAction("ERROR", `Failed to enhance workout: ${errorMessage}`);
    return workout;
  }
};

const formatInputPrompt = (
  workout: WorkoutPlan,
  enhancePrompt: string
): {
  systemPrompt: string;
  userPrompt: string;
} => {
  return {
    systemPrompt: `You are a helpful assistant that enhances workout plans. Return the enhanced workout plan in the same format as the input and nothing else.`,
    userPrompt: ` The workout plan is: "${JSON.stringify(
      workout
    )}" The enhance prompt is: "${enhancePrompt}"`,
  };
};

const parseModelResponse = (body: Uint8Array): WorkoutPlan => {
  const responseString = new TextDecoder("utf-8").decode(body);
  const responseJson = JSON.parse(responseString);
  const modelText = responseJson.content?.[0]?.text?.trim();
  const enhancedWorkout = JSON.parse(modelText) as WorkoutPlan;
  return enhancedWorkout;
};
