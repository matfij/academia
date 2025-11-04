import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { formatSuccessResponse } from "../utils/format-response";

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const workoutId = event.pathParameters?.["workoutId"];

  return formatSuccessResponse({ workoutId });
};
