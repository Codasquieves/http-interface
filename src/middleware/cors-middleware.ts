/* eslint-disable @typescript-eslint/no-unsafe-call */
import type { NextFunction, Request, Response } from "express";
import cors from "cors";
import type { ExpressMiddlewareInterface } from "routing-controllers";
import { Middleware } from "routing-controllers";
import { injectable } from "inversify";

@injectable()
@Middleware({ type: "before" })
export class CorsMiddleware implements ExpressMiddlewareInterface {
  public use(request: Request, response: Response, next: NextFunction): void {
    cors()(request, response, next);
  }
}
