import { Result } from "@codasquieves/base";
import { Logger } from "@codasquieves/logger";
import { inject, injectable } from "inversify";
import { Body, JsonController, Post } from "routing-controllers";

import { HttpResponse } from "../src/entities/http-response";

@injectable()
@JsonController("/test")
export class TestController {
  @inject(Logger)
  private readonly logger!: Logger;

  @Post("/")
  public test(@Body() body: unknown): HttpResponse {
    this.logger.info("POST: Test", { body });

    return HttpResponse.parse(
      Result.success({
        id: new Date(),
      })
    );
  }
}
