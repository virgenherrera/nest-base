import { NestFactory } from '@nestjs/core';

import { AppModule } from '../app.module';
import {
  ConfigClassNames,
  getAppConfigForExternalUse,
} from './get-app-config-for-external-use.util';

jest.mock('@nestjs/core', () => ({
  NestFactory: {
    createApplicationContext: jest.fn(),
  },
}));

const mockConfigService = {
  get: jest.fn(),
};

beforeEach(() => {
  jest.clearAllMocks();

  (NestFactory.createApplicationContext as jest.Mock).mockResolvedValue({
    get: jest.fn().mockReturnValue(mockConfigService),
    close: jest.fn().mockResolvedValue(null),
  });
  mockConfigService.get.mockImplementation(key => key);
});

afterAll(() => {
  jest.clearAllMocks();
});

describe(`UT:${getAppConfigForExternalUse.name}`, () => {
  it('should load specified configurations', async () => {
    const configNames: ConfigClassNames[] = ['AppConfig'];
    const configs = await getAppConfigForExternalUse(...configNames);

    expect(NestFactory.createApplicationContext).toHaveBeenCalledWith(
      AppModule,
      { logger: false },
    );
    configNames.forEach(name => {
      expect(mockConfigService.get).toHaveBeenCalledWith(name);
      expect(configs[name]).toBe(name);
    });
  });
});
