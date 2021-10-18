import { isNullOrUndefined } from "util";
import type { Container } from "inversify";
import type { ClassConstructor, IocAdapter } from "routing-controllers";

export class InversifyAdapter implements IocAdapter {
  private readonly container: Container;

  private readonly register?: (container: Container) => void;

  public constructor(container: Container, register?: (container: Container) => void) {
    this.container = container;
    this.register = register;
  }

  public get<T>(type: ClassConstructor<T>): T {
    const child = this.container.createChild();

    if (!isNullOrUndefined(this.register)) {
      this.register(child);
    }

    return child.get<T>(type);
  }
}
