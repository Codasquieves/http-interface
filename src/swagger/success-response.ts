import { ResponseSchema } from "routing-controllers-openapi";
import { StatusCodes } from "http-status-codes";

export const successResponse = (responseClass: Object, isArray = false): CallableFunction =>
  ResponseSchema(responseClass as Function, {
    description: "Success",
    isArray,
    statusCode: StatusCodes.OK,
  });
