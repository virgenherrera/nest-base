import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import * as winston from 'winston';
import { getPackageMetadata } from './get-package-metadata.util';

export function CreateWinstonLogger() {
  const { name } = getPackageMetadata();
  const logger = WinstonModule.createLogger({
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          nestWinstonModuleUtilities.format.nestLike(name),
        ),
      }),
    ],
  });

  return logger;
}
