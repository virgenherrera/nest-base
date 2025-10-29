import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export class GetHealthQueryDto extends createZodDto(
  z.object({
    appMeta: z
      .enum(['true', '1'])
      .optional()
      .transform((val) => /^(true|1)$/i.test(`${val}`)),
    uptime: z
      .enum(['true', '1'])
      .optional()
      .transform((val) => /^(true|1)$/i.test(`${val}`)),
  }),
) {}

export class GetHealthResponseDto extends createZodDto(
  z.object({
    appMeta: z.string().optional().meta({
      description: `if requested shows app MetaData. e.g. AppName@0.0.1`,
    }),
    status: z.literal('OK'),
    uptime: z.string().optional(),
  }),
) {}
