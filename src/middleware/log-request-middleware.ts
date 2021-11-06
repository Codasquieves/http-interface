import type { ExpressMiddlewareInterface } from "routing-controllers";
import { Middleware } from "routing-controllers";
import type { NextFunction, Response } from "express";
import { injectable } from "inversify";
import { isEmpty } from "lodash";
import { Logger } from "@codasquieves/logger";
import type { RequestContainer } from "../types";

@injectable()
@Middleware({ type: "before" })
export class LogRequestMiddleware implements ExpressMiddlewareInterface {
  public use(request: RequestContainer, response: Response, next: NextFunction): void {
    const params: Record<string, unknown> = {
      body: request.body,
      headers: request.headers,
      method: request.method,
      params: request.params,
      query: request.query,
      url: request.url,
    };

    Object.keys(params).forEach((key) => {
      if (isEmpty(params[key])) {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete params[key];
      }
    });

    const logger = request.ioc.get(Logger);

    response.header("x-correlation-id", logger.correlationId);

    logger.debug("Request", params);

    next();
  }
}
