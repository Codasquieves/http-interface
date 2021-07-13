import { classToPlain } from "class-transformer";
import type { Response } from "express";
import type { Action, InterceptorInterface } from "routing-controllers";
import { Interceptor } from "routing-controllers";
import { Logger } from "@codasquieves/logger";
import { inject, injectable } from "inversify";
import { HttpResponse } from "../entities/http-response";

@injectable()
@Interceptor()
class HttpResponseInterceptor implements InterceptorInterface {
  @inject(Logger)
  private readonly logger!: Logger;

  public intercept(action: Action, result: unknown): unknown {
    if (!(result instanceof HttpResponse)) {
      return result;
    }

    const response = action.response as Response;

    response.status(result.statusCode);
    response.header("x-correlation-id", this.logger.correlationId);

    return classToPlain(result.body ?? {});
  }
}
export { HttpResponseInterceptor };
