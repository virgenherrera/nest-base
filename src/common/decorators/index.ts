import { Logger as NestLogger } from '@nestjs/common';

export type Logger = NestLogger;

export function Logger(): PropertyDecorator {
  return (target: any, propertyKey: string | symbol) => {
    target[propertyKey] = new NestLogger(target.constructor.name);
  };
}
