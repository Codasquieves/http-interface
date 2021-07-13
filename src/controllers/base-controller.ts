import { INTERNAL_SERVER_ERROR } from "http-status-codes";
import { injectable } from "inversify";
import { HttpResponse } from "../entities/http-response";

@injectable()
export class BaseController {
  protected interalError: HttpResponse = new HttpResponse(INTERNAL_SERVER_ERROR);
}
