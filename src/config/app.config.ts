import { IsIn, IsPort } from 'class-validator';
import { env } from 'node:process';

export type Environment = (typeof AppConfig.AvailableEnvironments)[number];

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
  readonly environment: Environment =
    (env.NODE_ENV?.toUpperCase() as any) || 'DEVELOPMENT';

  @IsPort()
  readonly port: `${number}` = (env.APP_PORT as `${number}`) || '3000';
}
