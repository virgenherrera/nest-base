import { Logger as NestLogger } from '@nestjs/common';

const loggerInstancesMap = new Map<string, NestLogger>();

export type Logger = NestLogger;

export function Logger(): PropertyDecorator {
  return (target: object, propertyKey: string | symbol) => {
    const { name } = target.constructor;

    if (!loggerInstancesMap.has(name)) {
      loggerInstancesMap.set(name, new NestLogger(name));
    }

    const logger = loggerInstancesMap.get(name)!;

    Object.defineProperty(target, propertyKey, {
      value: logger,
      writable: false,
      enumerable: false,
    });
  };
}
