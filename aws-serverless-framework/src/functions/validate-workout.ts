import { APIGatewayProxyHandler } from "aws-lambda";
import { formatSuccessResponse } from "../utils/format-response";

export const handler: APIGatewayProxyHandler = async (event) => {
  return formatSuccessResponse("OK");
};
