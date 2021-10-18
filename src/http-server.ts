import { isNullOrUndefined } from "util";
import { Container } from "inversify";
import { createExpressServer, useContainer } from "routing-controllers";
import { BaseLogger, LogConfig, Logger } from "@codasquieves/logger";
import { HttpResponseInterceptor } from "./interceptors/http-response-interceptor";
import { HelmetMiddleware } from "./middleware/helmet-middleware";
import { ErrorHandlerMiddleware } from "./middleware/error-handler-middleware";
import type { HttpServerConfig } from "./http-server-config"
import type { HttpServer } from "./types";
import { InversifyAdapter } from "./adapters/inversify-adapter";

const registerContainer = (config: HttpServerConfig): Container => {
  const container = new Container();

  // Before
  container.bind(HelmetMiddleware).toSelf();

  // After
  container.bind(ErrorHandlerMiddleware).toSelf();

  // Interceptors
  container.bind(HttpResponseInterceptor).toSelf();

  container.bind(LogConfig).toConstantValue(config);
  container.bind(Logger).to(BaseLogger).inRequestScope();

  if (!isNullOrUndefined(config.register)) {
    config.register(container);
  }

  return container;
};

const createApiServer = (config: HttpServerConfig = {}): HttpServer => {
  const inversify = new InversifyAdapter(registerContainer(config));
  useContainer(inversify);

  return createExpressServer({
    authorizationChecker: config.authorizationChecker,
    classTransformer: false,
    controllers: config.controllers,
    cors: config.cors ?? false,
    currentUserChecker: config.currentUserChecker,
    defaultErrorHandler: false,
    interceptors: [HttpResponseInterceptor],
    middlewares: [
      // After
      HelmetMiddleware,

      // Before
      ErrorHandlerMiddleware,
    ],
  }) as HttpServer;
};

export { createApiServer };
