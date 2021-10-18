import { Logger } from "@codasquieves/logger";
import type { Response } from "express";
import { INTERNAL_SERVER_ERROR } from "http-status-codes";
import { injectable } from "inversify";
import type { ExpressErrorMiddlewareInterface } from "routing-controllers";
import { Middleware } from "routing-controllers";
import type { RequestContainer } from "../types";

@injectable()
@Middleware({ type: "after" })
export class ErrorHandlerMiddleware implements ExpressErrorMiddlewareInterface {

  public error(error: Error, request: RequestContainer, res: Response): void {
    const logger = request.ioc.get(Logger);

    logger.error("InternalServerError", error);
    
    res.status(INTERNAL_SERVER_ERROR).end();
  }
}
