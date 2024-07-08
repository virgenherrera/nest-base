import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsPositive } from 'class-validator';

export class BasePagedParamsDto {
  @ApiPropertyOptional({
    description: 'Current page number',
    example: 1,
    default: 1,
  })
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  page: number = 1;

  @ApiPropertyOptional({
    description: 'Number of results per page',
    example: 50,
    default: 50,
  })
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  perPage: number = 50;
}
