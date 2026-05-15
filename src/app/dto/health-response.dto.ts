import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export class HealthResponseDto extends createZodDto(
  z
    .object({
      status: z
        .literal('OK')
        .describe(
          'Constant health status indicator returned when the service responds.',
        ),
      appMeta: z
        .string()
        .optional()
        .describe(
          'Present when `appMeta` query parameter is true and contains the package name and version from package.json.',
        ),
      uptime: z
        .string()
        .optional()
        .describe(
          'Present when `uptime` query parameter is true and contains a human-friendly duration describing how long the service has been running.',
        ),
    })
    .meta({ title: 'HealthResponseDto' }),
) {}
