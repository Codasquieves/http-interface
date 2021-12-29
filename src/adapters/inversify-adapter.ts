import type { Container } from "inversify";
import type { ClassConstructor, IocAdapter } from "routing-controllers";

export class InversifyAdapter implements IocAdapter {
  private container!: Container;

  public setContainer(container: Container): void {
    this.container = container;
  }

  public get<T>(type: ClassConstructor<T>): T {
    return this.container.resolve<T>(type);
  }
}
