import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

import { Environments } from '../app/constants';

export class AppConfig extends createZodDto(
  z
    .object({
      APP_PORT: z.coerce.number().min(0).max(65535).default(3e3),
      HOSTNAME: z.string().nonempty().default('0.0.0.0'),
      NODE_ENV: z.enum(Environments),
      npm_package_name: z.string().nonempty(),
      npm_package_version: z.string().nonempty(),
    })
    .strip()
    .transform((nodeEnv) => ({
      environment: nodeEnv.NODE_ENV,
      hostname: nodeEnv.HOSTNAME,
      name: nodeEnv.npm_package_name,
      port: nodeEnv.APP_PORT,
      version: nodeEnv.npm_package_version,
    })),
) {}
