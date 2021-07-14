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
import { CorsMiddleware } from "./middleware/cors-middleware";

const registerContainer = (config: HttpServerConfig): Container => {
  const container = new Container();

  container.bind(LogRequestMiddleware).toSelf();
  container.bind(HelmetMiddleware).toSelf();
  container.bind(CorsMiddleware).toSelf();
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
    authorizationChecker: config.authorizationChecker,
    classTransformer: false,
    controllers: config.controllers,
    currentUserChecker: config.currentUserChecker,
    interceptors: [HttpResponseInterceptor],
    middlewares: [HelmetMiddleware, CorsMiddleware, ErrorHandlerMiddleware, LogRequestMiddleware]
  }) as HttpServer;
};

export { createApiServer };
