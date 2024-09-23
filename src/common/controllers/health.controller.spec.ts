import { Test } from '@nestjs/testing';
import { GetHealthResponseDto } from '../dto';
import { HealthController } from './health.controller';

describe(`UT:${HealthController.name}`, () => {
  const enum should {
    init = 'Should be initialized properly.',
    getHealth = 'Should return "up" status.',
  }

  let controller: HealthController = null;

  beforeAll(async () => {
    const testingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [],
    }).compile();

    controller = testingModule.get(HealthController);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it(should.init, async () => {
    expect(controller).not.toBeNull();
    expect(controller).toBeInstanceOf(HealthController);
  });

  it(should.getHealth, async () => {
    await expect(controller.getHealth()).resolves.toBeInstanceOf(
      GetHealthResponseDto,
    );
  });
});
