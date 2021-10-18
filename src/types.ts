import type { Request } from "express";
import type { Container } from "inversify";
import type { HttpResponse } from "./entities/http-response";

export interface HttpServer {
  listen: (port: number, callback?: () => void) => void;
}

// eslint-disable-next-line @typescript-eslint/no-type-alias
export type ControllerResponse = Promise<HttpResponse>;

export interface RequestContainer extends Request {
  ioc: Container;
}
