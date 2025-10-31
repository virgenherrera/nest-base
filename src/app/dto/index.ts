import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class GetHealthQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  appMeta?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  uptime?: boolean;
}

export class GetHealthResponseDto {
  @ApiPropertyOptional({
    description:
      'if requested via uptime Param will contain The App Name and version.',
    example: 'AppName@0.0.1',
  })
  appMeta?: string;

  @ApiProperty({
    example: 'OK',
  })
  status = 'OK';

  @ApiPropertyOptional({
    description:
      'if requested via uptime Param will contain The duration of time that has elapsed since the service has been online.',
    example: '3 hours ago',
  })
  uptime?: string;
}
