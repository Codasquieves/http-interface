import type { ExpressMiddlewareInterface } from "routing-controllers";
import { Middleware } from "routing-controllers";
import type { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { Logger } from "@codasquieves/logger";

@injectable()
@Middleware({ type: "after" })
export class LogRequestMiddleware implements ExpressMiddlewareInterface {
  @inject(Logger)
  private readonly logger!: Logger;

  public use(request: Request, _response: Response, next: NextFunction): void {
    this.logger.debug("Request", {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      body: request.body,
      headers: request.headers,
      params: request.params,
      query: request.query,
      url: request.url
    });

    next();
  }
}
