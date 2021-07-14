/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ResponseSchema } from "routing-controllers-openapi";
import { OK } from "http-status-codes";

export const successResponse = (responseClass: any, isArray = false): CallableFunction =>
  // eslint-disable-next-line @typescript-eslint/ban-types
  ResponseSchema(responseClass as Function, {
    description: "Success",
    isArray,
    statusCode: OK
  });
