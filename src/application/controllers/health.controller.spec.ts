import { Logger } from '@nestjs/common';

import { Test } from '@nestjs/testing';
import { MockLoggerProvider, mockLogger } from '../__mocks__';
import { GetHealthQueryDto, GetHealthResponseDto } from '../dto';
import { HealthController } from './health.controller';

describe(`UT:${HealthController.name}`, () => {
  const enum should {
    init = 'Should be initialized properly.',
    getHealth = 'Should get status "OK"  with no query params provided.',
    getHealthWithUptime = 'Should get status and Uptime when query Param was required.',
  }

  let controller: HealthController;
  let logger: Logger;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [MockLoggerProvider],
    }).compile();

    controller = moduleRef.get(HealthController);
    logger = moduleRef.get(Logger);

    // simulate Lifecycle hook
    controller.onApplicationBootstrap();
  });

  it(should.init, () => {
    expect(controller).toBeDefined();
    expect(controller).toBeInstanceOf(HealthController);
    expect(logger).toBeDefined();
    expect(mockLogger).toBe(mockLogger);
  });

  it(should.getHealth, () => {
    // Arrange
    const queryParams: GetHealthQueryDto = {};

    // Act
    const result = controller.getHealth(queryParams);

    // Assert
    expect(result).toBeInstanceOf(GetHealthResponseDto);
    expect(result.uptime).toBeUndefined();
  });

  it(should.getHealthWithUptime, () => {
    // Arrange
    const queryParams: GetHealthQueryDto = { uptime: true };

    // Act
    const result = controller.getHealth(queryParams);

    // Assert
    expect(result).toBeInstanceOf(GetHealthResponseDto);
    expect(result.uptime).toBeDefined();
  });
});
