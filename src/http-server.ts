import { isNullOrUndefined } from "util";
import { Container } from "inversify";
import { createExpressServer, useContainer } from "routing-controllers";
import { BaseLogger, LogConfig, Logger } from "@codasquieves/logger";
import { HttpResponseInterceptor } from "./interceptors/http-response-interceptor";
import { HelmetMiddleware } from "./middleware/helmet-middleware";
import { ErrorHandlerMiddleware } from "./middleware/error-handler-middleware";
import type { HttpServerConfig } from "./http-server-config";
import type { HttpServer } from "./types";
import { InversifyAdapter } from "./adapters/inversify-adapter";
import { IocMiddleware } from "./middleware/ioc-middleware";
import { LogRequestMiddleware } from "./middleware/log-request-middleware";

// eslint-disable-next-line @typescript-eslint/init-declarations
export let baseContainer: () => Container;

const defaulRegister = (config: HttpServerConfig): Container => {
  const container = new Container({
    defaultScope: "Singleton",
  });

  // Interceptors
  container.bind(HttpResponseInterceptor).toSelf();

  container.bind(LogConfig).toConstantValue(config);
  container.bind(Logger).to(BaseLogger);

  if (!isNullOrUndefined(config.register)) {
    config.register(container);
  }

  return container;
};

const createApiServer = (config: HttpServerConfig = {}): HttpServer => {
  const adapter = new InversifyAdapter([
    IocMiddleware,
    HelmetMiddleware,
    ErrorHandlerMiddleware,
    HttpResponseInterceptor,
    LogRequestMiddleware,
  ]);
  useContainer(adapter);
  baseContainer = (): Container => defaulRegister(config);

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
      IocMiddleware,
      HelmetMiddleware,
      LogRequestMiddleware,

      // Before
      ErrorHandlerMiddleware,
    ],
    routePrefix: config.routePrefix,
  }) as HttpServer;
};

export { createApiServer };
