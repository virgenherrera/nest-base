import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class GetHealthQueryDto {
  @ApiPropertyOptional({
    description:
      'Set to true to include application metadata (package name and version from package.json) in the health response.',
    type: Boolean,
    example: true,
  })
  @IsOptional()
  appMeta?: boolean;

  @ApiPropertyOptional({
    description:
      'Set to true to include service uptime information (in seconds) in the health response.',
    type: Boolean,
    example: true,
  })
  @IsOptional()
  uptime?: boolean;
}
