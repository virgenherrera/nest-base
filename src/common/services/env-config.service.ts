import { Injectable } from '@nestjs/common';
import { ConfigService, NoInferType } from '@nestjs/config';
import { Environment } from '../enums/environment.enum';

@Injectable()
export class EnvConfigService {
  environment: Environment;
  port = 3000;

  constructor(private configService: ConfigService) {
    this.ensureEnvironment();
    this.ensurePort();

    Object.freeze(this);
    Object.seal(this);
  }

  private ensureEnvironment() {
    const NODE_ENV = this.configService.get<Environment>('NODE_ENV');
    const valueKey = NODE_ENV || Environment.development;

    this.environment = Environment[valueKey];
  }

  private ensurePort() {
    const APP_PORT = this.get<string>('APP_PORT');

    if (APP_PORT) {
      this.port = Number(APP_PORT);
    }
  }

  get openApiPath() {
    const defaultValue = 'api-docs/';
    const value = this.get<string>('APP_OPEN_API_PATH');

    return !value ? defaultValue : value;
  }

  get<T = any>(propertyPath: string, defaultValue?: NoInferType<T>) {
    return this.configService.get<T>(propertyPath, defaultValue);
  }
}
