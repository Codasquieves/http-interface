import { isNullOrUndefined } from "util";
import { Container } from "inversify";
import { createExpressServer, useContainer } from "routing-controllers";
import { BaseLogger, LogConfig, Logger } from "@codasquieves/logger";
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

  container.bind(LogConfig).toConstantValue(config);
  container.bind(Logger).to(BaseLogger).inSingletonScope();

  if (!isNullOrUndefined(config.register)) {
    config.register(container);
  }

  return container;
};

const createApiServer = (config: HttpServerConfig = {}): HttpServer => {
  useContainer(registerContainer(config));

  return createExpressServer({
    authorizationChecker: config.authorizationChecker,
    classTransformer: false,
    controllers: config.controllers,
    cors: config.cors ?? false,
    currentUserChecker: config.currentUserChecker,
    defaultErrorHandler: false,
    interceptors: [HttpResponseInterceptor],
    middlewares: [
      HelmetMiddleware,
      ErrorHandlerMiddleware,
      LogRequestMiddleware
    ],
  }) as HttpServer;
};

export { createApiServer };
