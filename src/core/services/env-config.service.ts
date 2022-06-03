import { Injectable } from '@nestjs/common';
import { ConfigService, NoInferType } from '@nestjs/config';
import { Environment } from '../enums/environment.enum';

@Injectable()
export class EnvConfigService {
  environment: Environment;

  constructor(private configService: ConfigService) {
    this.ensureEnvironment();
  }

  private ensureEnvironment() {
    const NODE_ENV = this.configService.get<Environment>('NODE_ENV');
    const valueKey = NODE_ENV || Environment.development;

    this.environment = Environment[valueKey];
  }

  get port() {
    const APP_PORT = this.get<string>('APP_PORT', '0');

    return Number(APP_PORT);
  }

  get openApiPath() {
    const defaultValue = 'dist/openApi-docs/';
    const value = this.get<string>('APP_OPEN_API_PATH');

    return !value ? defaultValue : value;
  }

  get<T = any>(propertyPath: string, defaultValue?: NoInferType<T>) {
    return this.configService.get<T>(propertyPath, defaultValue);
  }
}
