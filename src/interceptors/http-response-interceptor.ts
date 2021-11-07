import { classToPlain } from "class-transformer";
import type { Response } from "express";
import { injectable } from "inversify";
import type { Action, InterceptorInterface } from "routing-controllers";
import { Interceptor } from "routing-controllers";
import { HttpResponse } from "../entities/http-response";

@Interceptor()
@injectable()
class HttpResponseInterceptor implements InterceptorInterface {
  public intercept(action: Action, result: unknown): unknown {
    if (!(result instanceof HttpResponse)) {
      return result;
    }

    const response = action.response as Response;

    response.status(result.statusCode);
    return classToPlain(result.body ?? {});
  }
}
export { HttpResponseInterceptor };
