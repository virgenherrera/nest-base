import { Logger as NestLogger } from '@nestjs/common';

export type Logger = NestLogger;

export function Logger(): PropertyDecorator {
  return (target, propertyKey) => {
    target[propertyKey] = new NestLogger(target.constructor.name);
  };
}
