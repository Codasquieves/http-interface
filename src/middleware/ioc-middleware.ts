import type { NextFunction, Response } from "express";
import type { ExpressMiddlewareInterface } from "routing-controllers";
import { Middleware } from "routing-controllers";
import type { RequestContainer } from "../types";
import { baseContainer } from "../http-server";

@Middleware({ type: "before" })
export class IocMiddleware implements ExpressMiddlewareInterface {
  public use(request: RequestContainer, _response: Response, next: NextFunction): void {
    request.ioc = baseContainer();

    next();
  }
}
