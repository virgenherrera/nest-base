import { Test } from '@nestjs/testing';
import { AppConfig } from '../../config';
import { GetHealthQueryDto } from '../dto';
import { HealthController } from './health.controller';

describe(`UT:${HealthController.name}`, () => {
  const enum should {
    init = 'Should be initialized properly.',
    getHealth = 'Should get status "OK"  with no query params provided.',
    getHealthWithMeta = 'Should get status and Uptime when optional query Param was requested.',
  }

  let controller: HealthController;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: `CONFIGURATION(${AppConfig.name})`,
          useValue: {
            name: 'mocked-name',
            version: '0.0.0',
          },
        },
      ],
    }).compile();

    controller = moduleRef.get(HealthController);

    // simulate Lifecycle hook
    controller.onApplicationBootstrap();
  });

  it(should.init, () => {
    expect(controller).toBeDefined();
    expect(controller).toBeInstanceOf(HealthController);
  });

  it(should.getHealth, async () => {
    // Arrange
    const queryParams = {} as GetHealthQueryDto;

    // Act & Assert
    await expect(controller.getHealth(queryParams)).resolves.toMatchObject({
      status: 'OK',
    });
  });

  it(should.getHealthWithMeta, async () => {
    // Arrange
    const queryParams: GetHealthQueryDto = {
      appMeta: true,
      uptime: true,
    };

    // Act & Assert
    await expect(controller.getHealth(queryParams)).resolves.toMatchObject({
      appMeta: expect.stringMatching(/^([\w-]+)@(\d+\.\d+\.\d+)$/),
      status: 'OK',
      uptime: expect.stringMatching(/.{1,}/),
    });
  });
});
