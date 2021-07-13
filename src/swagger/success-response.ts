import type { Types } from "@codasquieves/base";
import { ResponseSchema } from "routing-controllers-openapi";
import { OK } from "http-status-codes";

export const successResponse = <T>(responseClass: Types.Constructor<T>, isArray = false): CallableFunction =>
  // eslint-disable-next-line @typescript-eslint/ban-types
  ResponseSchema(responseClass as Function, {
    description: "Success",
    isArray,
    statusCode: OK
  });
