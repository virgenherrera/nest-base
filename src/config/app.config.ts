import { LOG_LEVELS, type LogLevel } from '@nestjs/common';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const LogLevelSchema = z.enum([...LOG_LEVELS] as [LogLevel, ...LogLevel[]]);

export class AppConfig extends createZodDto(
  z
    .object({
      APP_ENV: z
        .string()
        .optional()
        .transform((value) => (value ? value : 'local')),
      APP_LOG_LEVELS: z
        .string()
        .optional()
        .transform((value) => {
          return !value
            ? LOG_LEVELS
            : value
                .split(',')
                .map((level) => level.trim())
                .filter((level) => level.length > 0);
        })
        .pipe(z.array(LogLevelSchema)),
      npm_package_name: z.string().min(1),
      npm_package_version: z.string().min(1),
    })
    .transform((value) => ({
      environmentLabel: value.APP_ENV,
      logLevels: value.APP_LOG_LEVELS,
      name: value.npm_package_name,
      version: value.npm_package_version,
    })),
) {}
