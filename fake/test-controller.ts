import { Result } from "@codasquieves/base";
import { Logger } from "@codasquieves/logger";
import { inject, injectable } from "inversify";
import { Get, JsonController } from "routing-controllers";
import type { ControllerResponse } from "../index";
import { HttpResponse } from "../index";

@injectable()
@JsonController("/test")
export class TestController {
  @inject(Logger)
  private readonly logger!: Logger;

  @Get("/")
  public async test(): Promise<ControllerResponse> {
    this.logger.info("GET: Test");

    await Promise.resolve();
    return HttpResponse.parse(Result.conflict());
  }
}
