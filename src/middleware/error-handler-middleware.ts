import type { Request, Response } from "express";
import { INTERNAL_SERVER_ERROR } from "http-status-codes";
import type { ExpressErrorMiddlewareInterface} from "routing-controllers";
import { HttpError, Middleware } from "routing-controllers";
import { injectable } from "inversify";
import { HttpResponse } from "../entities/http-response";

@injectable()
@Middleware({ type: "after" })
export class ErrorHandlerMiddleware implements ExpressErrorMiddlewareInterface {
  public error(error: Error, _request: Request, res: Response): void {
    if (error instanceof HttpError) {
      this.handleHttpError(res, error);

      return;
    }

    const response = new HttpResponse(INTERNAL_SERVER_ERROR);
    res.status(response.statusCode);
    res.json(response.body);
  }

  private handleHttpError(response: Response, error: HttpError): void {
    response.status(error.httpCode);
    response.header("Content-Type", "application/json");
    response.send(JSON.stringify(error));
  }
}
