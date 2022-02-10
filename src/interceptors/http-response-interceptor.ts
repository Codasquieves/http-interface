import type { Response } from "express";
import { injectable } from "inversify";
import type { Action, InterceptorInterface } from "routing-controllers";
import { Interceptor } from "routing-controllers";
import { HttpResponse } from "../entities/http-response";

@Interceptor()
@injectable()
class HttpResponseInterceptor implements InterceptorInterface {
  public intercept(action: Action, result: unknown): unknown {
    const response = action.response as Response

    if (!(result instanceof HttpResponse)) {
      return result;
    }

    result.headers.forEach(([key, value]) => response.set(key, value))
    response.status(result.statusCode)
    
    return result.body ?? {};
  }
}
export { HttpResponseInterceptor };
