import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GetHealthResponseDto {
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
