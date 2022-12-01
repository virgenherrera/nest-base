import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Logger } from '../decorators';
import { Environment } from '../enums/environment.enum';

@Injectable()
export class EnvironmentService {
  @Logger() private logger: Logger;

  private _environment: Environment;
  private _port: number;
  private _openApiPath: string;

  constructor(private configService: ConfigService) {
    this.setEnvironment();
    this.setPort();
    this.setOpenApiPath();
  }

  get environment() {
    return this._environment;
  }

  get port() {
    return this._port;
  }

  get openApiPath() {
    return this._openApiPath;
  }

  private setEnvironment() {
    this.logger.log('setting "environment"');

    const NODE_ENV = this.configService.get<Environment>('NODE_ENV');
    const valueKey = NODE_ENV || Environment.development;

    this._environment = Environment[valueKey];
  }

  private setPort() {
    this.logger.log('setting "port"');

    const APP_PORT = this.configService.get<string>('APP_PORT');

    this._port = APP_PORT ? Number(APP_PORT) : 3000;
  }

  private setOpenApiPath() {
    this.logger.log('setting "openApiPath"');

    const defaultValue = 'api-docs/';
    const value = this.configService.get<string>('APP_OPEN_API_PATH');

    this._openApiPath = value ?? defaultValue;
  }
}
