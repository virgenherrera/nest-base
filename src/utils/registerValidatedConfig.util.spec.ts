import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';

import { registerValidatedConfig } from './registerValidatedConfig.util';

describe(`UT:${registerValidatedConfig.name}`, () => {
  it('should register a valid configuration without throwing an error', () => {
    class ValidTestConfig {
      @IsInt()
      @Min(1)
      @Max(65535)
      port: number = 3000;

      @IsString()
      @IsNotEmpty()
      name: string = 'TestApp';
    }

    const getConfig = registerValidatedConfig(ValidTestConfig);
    let result: ValidTestConfig = null;

    expect(() => (result = getConfig() as any)).not.toThrow();
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidTestConfig);
  });

  it('should throw an error for an invalid configuration', () => {
    class InvalidTestConfig {
      @IsInt()
      @Min(1)
      @Max(65535)
      port: number = 70000;

      @IsString()
      @IsNotEmpty()
      name: string = '';
    }

    const getConfig = registerValidatedConfig(InvalidTestConfig);
    expect(() => getConfig()).toThrow(TypeError);
  });
});
