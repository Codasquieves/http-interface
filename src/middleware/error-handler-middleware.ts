import type { Request, Response } from "express";
import { INTERNAL_SERVER_ERROR } from "http-status-codes";
import type { ExpressErrorMiddlewareInterface } from "routing-controllers";
import { Middleware } from "routing-controllers";
import { inject, injectable } from "inversify";
import { Logger } from "@codasquieves/logger";

@injectable()
@Middleware({ type: "after" })
export class ErrorHandlerMiddleware implements ExpressErrorMiddlewareInterface {
  @inject(Logger)
  private readonly logger!: Logger;

  public error(error: Error, _request: Request, res: Response): void {
    this.logger.error("InternalServerError", error);
    res.status(INTERNAL_SERVER_ERROR).end();
  }
}
