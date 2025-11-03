import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class GetHealthQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  appMeta?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  uptime?: boolean;
}
