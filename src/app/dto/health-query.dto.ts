import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class HealthQueryDto {
  @ApiPropertyOptional({
    description:
      'Set to true to include application metadata (package name and version from package.json) in the health response.',
    type: Boolean,
    example: true,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  appMeta?: boolean;

  @ApiPropertyOptional({
    description:
      'Set to true to include service uptime information (in seconds) in the health response.',
    type: Boolean,
    example: true,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  uptime?: boolean;
}
