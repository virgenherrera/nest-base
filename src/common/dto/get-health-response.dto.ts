import { ApiProperty } from '@nestjs/swagger';

export class GetHealthResponseDto {
  @ApiProperty({
    description:
      'The duration of time that has elapsed since the service has been online.',
    example: '3 hours ago',
  })
  uptime: string;
}
