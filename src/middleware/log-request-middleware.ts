import type { ExpressMiddlewareInterface } from "routing-controllers";
import { Middleware } from "routing-controllers";
import type { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { Logger } from "@codasquieves/logger";
import { isEmpty } from "lodash";

@injectable()
@Middleware({ type: "before" })
export class LogRequestMiddleware implements ExpressMiddlewareInterface {
  @inject(Logger)
  private readonly logger!: Logger;

  public use(request: Request, response: Response, next: NextFunction): void {
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
    })

    response.header("x-correlation-id", this.logger.correlationId);

    this.logger.debug("Request", params);

    next();
  }
}
