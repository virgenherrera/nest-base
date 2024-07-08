import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BaseCreatedDto {
  @ApiProperty({
    description: 'ID of the created Entity',
    example: '5f6d28b-4290-48e0-9386-1a3c64fb4a',
  })
  id: string;

  @ApiProperty({
    description: 'Timestamp of when the Entity was created at',
    example: '2022-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Timestamp of when the Entity was updated at',
    example: '2022-01-01T00:00:00.000Z',
  })
  updatedAt: Date;

  @ApiPropertyOptional({
    description: 'If present Timestamp of when the Entity was soft deleted at',
    example: '2022-01-01T00:00:00.000Z',
  })
  deletedAt?: Date;
}
