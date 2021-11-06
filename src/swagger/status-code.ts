import { OpenAPI } from "routing-controllers-openapi";

export const statusCode = (status: number, description = ""): CallableFunction =>
  OpenAPI({
    responses: {
      [status.toString()]: {
        description: description,
      },
    },
  });
