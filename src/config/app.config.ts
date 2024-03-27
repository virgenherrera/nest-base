import { IsIn, IsInt, IsNumber, Max, Min } from 'class-validator';

export class AppConfig {
  static readonly AvailableEnvironments = [
    'DEVELOPMENT',
    'TEST',
    'E2E',
    'QA',
    'UAT',
    'PROD',
  ] as const;

  @IsIn(AppConfig.AvailableEnvironments)
  readonly environment: (typeof AppConfig.AvailableEnvironments)[number] =
    (process.env.NODE_ENV?.toUpperCase() as any) || 'DEVELOPMENT';

  @IsInt()
  @Min(0)
  @Max(65535)
  readonly port: number = process.env.APP_PORT
    ? Number(process.env.APP_PORT)
    : 3000;

  @IsNumber()
  @Min(0)
  @Max(100)
  readonly cpuThreshold: number = process.env.APP_CPU_THRESHOLD
    ? Number(process.env.APP_CPU_THRESHOLD)
    : 80;
}
