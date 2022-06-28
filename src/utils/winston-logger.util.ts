import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import * as winston from 'winston';
import { LoggerOptions } from 'winston';
import { getPackageMetadata } from './get-package-metadata.util';

export function CreateWinstonLogger() {
  const { name } = getPackageMetadata();
  const options: LoggerOptions = {
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          nestWinstonModuleUtilities.format.nestLike(name),
        ),
      }),
    ],
  };

  return WinstonModule.createLogger(options);
}
