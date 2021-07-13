import { isNullOrUndefined } from "util";
import { Container } from "inversify";
import { useContainer, createExpressServer } from "routing-controllers";
import { BatchLogger, ConsoleLogger, Logger } from "@codasquieves/logger";
import { InversifyAdapter } from "./adapters/inversify-adapter"
import { HttpResponseInterceptor } from "./interceptors/http-response-interceptor";
import { HelmetMiddleware } from "./middleware/helmet-middleware";
import { ErrorHandlerMiddleware } from "./middleware/error-handler-middleware";
import { LogRequestMiddleware } from "./middleware/log-request-middleware";
import type { HttpServerConfig } from "./http-server-config"
import type { HttpServer } from "./types";

const registerContainer = (config: HttpServerConfig): Container => {
  const container = new Container();

  container.bind(LogRequestMiddleware).toSelf();
  container.bind(HelmetMiddleware).toSelf();
  container.bind(ErrorHandlerMiddleware).toSelf();
  container.bind(HttpResponseInterceptor).toSelf();

  if (config.batchLogger ?? false) {
    container.bind(Logger).toConstantValue(new BatchLogger(config));
  } else {
    container.bind(Logger).toConstantValue(new ConsoleLogger(config));
  }

  if (!isNullOrUndefined(config.register)) {
    config.register(container);
  }

  return container;
};

const createApiServer = (config: HttpServerConfig = {}): HttpServer => {
  const container = registerContainer(config);

  const adapter = new InversifyAdapter(container);
  useContainer(adapter);

  return createExpressServer({
    classTransformer: false,
    controllers: config.controllers,
    interceptors: [HttpResponseInterceptor],
    middlewares: [HelmetMiddleware, ErrorHandlerMiddleware, LogRequestMiddleware]
  }) as HttpServer;
};

export { createApiServer };
