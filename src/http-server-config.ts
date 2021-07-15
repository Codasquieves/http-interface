import type { LogConfig } from "@codasquieves/logger";
import type { Container } from "inversify";
import type { AuthorizationChecker } from "routing-controllers/types/AuthorizationChecker";
import type { CurrentUserChecker } from "routing-controllers/types/CurrentUserChecker";

export interface HttpServerConfig extends LogConfig {
  currentUserChecker?: CurrentUserChecker,
  authorizationChecker?: AuthorizationChecker,
  // eslint-disable-next-line @typescript-eslint/ban-types
  controllers?: Function[];
  register?: (container: Container) => void;
}
