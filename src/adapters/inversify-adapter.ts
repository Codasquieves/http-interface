/* eslint-disable @typescript-eslint/ban-types */
import type { Container } from "inversify";
import { get } from "lodash";
import type { Action, ClassConstructor, IocAdapter } from "routing-controllers";

export class InversifyAdapter implements IocAdapter {
  private readonly toIgnore: ClassConstructor<Object>[];

  public constructor(toIgnore: ClassConstructor<Object>[] = []) {
    this.toIgnore = toIgnore;
  }

  public get<T>(type: ClassConstructor<T>, action?: Action): T {
    if (this.toIgnore.includes(type)) {
      return new type();
    }

    const container = get(action, "request.ioc", null) as Container | null;

    if (container === null) {
      throw Error(`${type.name}: not in container`);
    }

    return container.get<T>(type);
  }
}
