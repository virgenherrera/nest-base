import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GetHealthResponseDto {
  @ApiProperty({
    description:
      'Constant health status indicator returned when the service responds.',
    example: 'OK',
    type: String,
  })
  status = 'OK';

  @ApiPropertyOptional({
    description:
      'Present when `appMeta` query parameter is true and contains the package name and version from package.json.',
    example: 'app-name@0.0.1',
  })
  appMeta?: string;

  @ApiPropertyOptional({
    description:
      'Present when `uptime` query parameter is true and contains a human-friendly duration describing how long the service has been running.',
    example: 'about 3 hours',
  })
  uptime?: string;
}
