import { registerAs } from '@nestjs/config';
import { IsInt, IsNotEmpty, IsPort, IsString, Max, Min } from 'class-validator';

import { EnvSchemaLoader } from './env-schema-loader.util';

describe(`UT:${EnvSchemaLoader.name}`, () => {
  class ValidTestConfig {
    @IsInt()
    @Min(1)
    @Max(65535)
    port: number = 3000;

    @IsString()
    @IsNotEmpty()
    name: string = 'TestApp';
  }

  class InvalidTestConfig {
    @IsNotEmpty()
    @IsString()
    @IsPort()
    port = 70000;

    @IsString()
    @IsNotEmpty()
    name = '';
  }

  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it('Should register a valid configuration without throwing an error', async () => {
    let expectedFactory: ReturnType<typeof registerAs> = null;

    expect(
      () => (expectedFactory = EnvSchemaLoader.validate(ValidTestConfig)),
    ).not.toThrow();
    expect(expectedFactory).not.toBeNull();
    expect(expectedFactory.KEY).toBe(`CONFIGURATION(${ValidTestConfig.name})`);

    await expect(expectedFactory()).resolves.toBeInstanceOf(ValidTestConfig);
  });

  it('Should end process for an invalid configuration', async () => {
    const warnSpy = jest
      .spyOn(console, 'warn')
      .mockImplementation(() => undefined);
    const logSpy = jest
      .spyOn(console, 'log')
      .mockImplementation(() => undefined);
    const traceSpy = jest
      .spyOn(console, 'trace')
      .mockImplementation(() => undefined);

    jest.spyOn(process, 'exit').mockImplementation((code?: number): never => {
      throw new Error(`process.exit: ${code}`);
    });

    let expectedFactory: ReturnType<typeof registerAs> = null;

    expect(
      () => (expectedFactory = EnvSchemaLoader.validate(InvalidTestConfig)),
    ).not.toThrow();
    expect(expectedFactory).not.toBeNull();
    expect(expectedFactory.KEY).toBe(
      `CONFIGURATION(${InvalidTestConfig.name})`,
    );

    await expect(expectedFactory()).rejects.toThrow('process.exit: 1');
    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(logSpy).toHaveBeenCalled();
    expect(traceSpy).toHaveBeenCalledTimes(1);
  });
});
