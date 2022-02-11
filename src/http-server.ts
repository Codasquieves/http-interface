import { isNullOrUndefined } from "util";
import type { NextFunction, Request, Response } from "express";
import express from "express";
import { Container } from "inversify";
import { useContainer, useExpressServer } from "routing-controllers";
import { BaseLogger, LogConfig, Logger } from "@codasquieves/logger";
import helmet from "helmet";
import { get, isEmpty, isUndefined } from "lodash";
import { StatusCodes } from "http-status-codes";
import { HttpResponseInterceptor } from "./interceptors/http-response-interceptor";
import type { HttpServerConfig } from "./http-server-config";
import type { HttpServer, RequestContainer } from "./types";
import { InversifyAdapter } from "./adapters/inversify-adapter";

const createContainer = (config: HttpServerConfig): Container => {
  const container = new Container({
    defaultScope: "Singleton",
  });

  container.bind(HttpResponseInterceptor).toSelf();

  container.bind(LogConfig).toConstantValue(config);
  container.bind(Logger).to(BaseLogger);

  if (!isNullOrUndefined(config.register)) {
    config.register(container);
  }

  return container;
};

const createApiServer = (config: HttpServerConfig = {}): HttpServer => {
  const containerAdapter = new InversifyAdapter();
  useContainer(containerAdapter);

  const app = express();

  app.use(helmet());
  app.use(express.json());

  app.use((req: Request, _res: Response, next: NextFunction) => {
    const container = createContainer(config);
    containerAdapter.setContainer(container);

    (req as RequestContainer).ioc = container;

    next();
  });

  app.use((req: Request, res: Response, next: NextFunction) => {
    const request = req as RequestContainer;

    const params: Record<string, unknown> = {
      body: request.body,
      headers: request.headers,
      method: request.method,
      params: request.params,
      query: request.query,
      url: request.url,
    };

    Object.keys(params).forEach((key) => {
      if (isEmpty(params[key])) {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete params[key];
      }
    });

    const logger = request.ioc.get(Logger);

    res.header("x-correlation-id", logger.correlationId);

    logger.debug("Request", params);

    next();
  });

  useExpressServer(app, {
    authorizationChecker: config.authorizationChecker,
    classTransformer: false,
    controllers: config.controllers,
    cors: config.cors ?? false,
    currentUserChecker: config.currentUserChecker,
    defaultErrorHandler: false,
    interceptors: [...(config.interceptors ?? []), HttpResponseInterceptor],
    middlewares: config.middlewares,
    routePrefix: config.routePrefix,
  });

  app.use((error: Error, req: Request, res: Response, _next: NextFunction) => {
    const request = req as RequestContainer;
    const logger = request.ioc.get(Logger);

    const errorHttpCode = get(error, "httpCode", undefined) as number | undefined;

    const expectedHttpCodes = [StatusCodes.UNAUTHORIZED as number];

    if (!isUndefined(errorHttpCode) && expectedHttpCodes.includes(errorHttpCode)) {
      res.sendStatus(errorHttpCode).end();
      return;
    }

    logger.error("internal-server-error", error);

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
  });

  return app as HttpServer;
};

export { createApiServer };
