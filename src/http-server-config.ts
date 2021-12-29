import type { LogConfig } from "@codasquieves/logger";
import type { Container } from "inversify";
import type { AuthorizationChecker } from "routing-controllers/types/AuthorizationChecker";
import type { CurrentUserChecker } from "routing-controllers/types/CurrentUserChecker";

export interface HttpServerConfig extends LogConfig {
  currentUserChecker?: CurrentUserChecker;
  authorizationChecker?: AuthorizationChecker;
  controllers?: Function[];
  middlewares?: Function[];
  interceptors?: Function[];
  register?: (container: Container) => void;
  cors?: boolean;
  routePrefix?: string;
}
