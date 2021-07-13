import type { LogConfig } from "@codasquieves/logger";
import type { Container } from "inversify";

export interface HttpServerConfig extends LogConfig {
  // eslint-disable-next-line @typescript-eslint/ban-types
  controllers?: Function[];
  batchLogger?: boolean;
  register?: (container: Container) => void;
}
