import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { getEnvVar, scanTable } from "../common/utils";
import { CustomerEntity } from "../definitions/types";

export const getCustomers = async (
  _event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const customers = await scanTable<CustomerEntity>(
      getEnvVar("DYNAMODB_CUSTOMER_TABLE")
    );
    return {
      statusCode: 200,
      body: JSON.stringify({
        customers: customers,
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: `Internal server error: ${err}`,
      }),
    };
  }
};
