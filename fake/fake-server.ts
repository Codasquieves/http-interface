import { LogLevel } from "@codasquieves/logger";
import type { Container } from "inversify";
import type { HttpServer } from "../index";
import { createApiServer } from "../index";
import { TestController } from "./test-controller";

export class FakeServer {
  public static factory(): HttpServer {
    return createApiServer({
      blackList: ["password"],
      controllers: [TestController],
      cors: true,
      logLevel: LogLevel.debug,
      register: (container: Container) => {
        container.bind(TestController).toSelf();
      }
    });
  }
}
