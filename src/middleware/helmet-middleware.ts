import type { NextFunction, Request, Response } from "express";
import helmet from "helmet";
import type { ExpressMiddlewareInterface } from "routing-controllers";
import { Middleware } from "routing-controllers";

@Middleware({ type: "before" })
export class HelmetMiddleware implements ExpressMiddlewareInterface {
  public use(request: Request, response: Response, next: NextFunction): void {
    helmet()(request, response, next);
  }
}
