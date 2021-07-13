import { isNullOrUndefined } from "util";
import type { Result} from "@codasquieves/base";
import { ResultType } from "@codasquieves/base";
import * as StatusCodes from "http-status-codes";

const parseStatus = {
  [ResultType.success]: StatusCodes.OK,
  [ResultType.created]: StatusCodes.CREATED,
  [ResultType.process_async]: StatusCodes.ACCEPTED,
  [ResultType.invalid_execution]: StatusCodes.BAD_REQUEST,
  [ResultType.not_found]: StatusCodes.NOT_FOUND,
  [ResultType.conflict]: StatusCodes.CONFLICT,
  [ResultType.unprocessable]: StatusCodes.UNPROCESSABLE_ENTITY,
  [ResultType.error]: StatusCodes.INTERNAL_SERVER_ERROR,
  [ResultType.unauthorized]: StatusCodes.UNAUTHORIZED,
};

export class HttpResponse {
  public body?: unknown;

  public statusCode: number;

  public constructor(statusCode: number, body?: unknown) {
    this.statusCode = statusCode;
    this.body = body;
  }

  public static parse(applicationResult: Result): HttpResponse {
    let status = parseStatus[applicationResult.event];
    const body = isNullOrUndefined(applicationResult.data) ? undefined : applicationResult.data;

    if (isNullOrUndefined(body) && status === StatusCodes.OK) {
      status = StatusCodes.NO_CONTENT;
    }

    return new HttpResponse(status, body);
  }
}
