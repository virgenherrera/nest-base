import { Transform, TransformFnParams } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';
import { SystemHealth } from '../models';

export class GetHealthQueryDto implements Record<keyof SystemHealth, boolean> {
  static boolTransform({ value }: TransformFnParams) {
    return ['1', 'true'].includes(value);
  }

  @IsOptional()
  @Transform(GetHealthQueryDto.boolTransform)
  @IsBoolean()
  cpuUsage = false;

  @IsOptional()
  @Transform(GetHealthQueryDto.boolTransform)
  @IsBoolean()
  memoryUsage = false;

  @IsOptional()
  @Transform(GetHealthQueryDto.boolTransform)
  @IsBoolean()
  uptime = true;

  @IsOptional()
  @Transform(GetHealthQueryDto.boolTransform)
  @IsBoolean()
  uptimeSince = true;
}
