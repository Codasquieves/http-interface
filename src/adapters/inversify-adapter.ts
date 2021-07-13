import type { Container } from "inversify";
import type { ClassConstructor, IocAdapter } from "routing-controllers";

export class InversifyAdapter implements IocAdapter {
  private readonly container: Container;

  public constructor(container: Container) {
    this.container = container;
  }

  public get<T>(type: ClassConstructor<T>): T {
    const child = this.container.createChild();

    return child.get<T>(type);
  }
}
