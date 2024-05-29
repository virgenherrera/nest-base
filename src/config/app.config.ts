import { IsIn, IsInt, Max, Min } from 'class-validator';

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
}
