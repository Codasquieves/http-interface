import { Result } from "@codasquieves/base";
import { injectable } from "inversify";
import { Get, JsonController } from "routing-controllers";
import type { ControllerResponse } from "../index";
import { HttpResponse } from "../index";

@injectable()
@JsonController("/test")
export class TestController {
  @Get("/")
  public async test(): Promise<ControllerResponse> {
    throw Error();
    await Promise.resolve();
    return HttpResponse.parse(Result.success());
  }
}
