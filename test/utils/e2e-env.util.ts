import { ConfigService } from '@nestjs/config';

export const e2eMockENV = {
  SHARED_FOLDER_PATH: './dist/MOCK_SHARED_FOLDER',
};

export const mockConfigService: Record<keyof ConfigService, any> = {
  get: jest.fn().mockImplementation(envKey => e2eMockENV[envKey]),
  getOrThrow: jest.fn(),
  changes$: jest.fn(),
  set: jest.fn(),
  setEnvFilePaths: jest.fn(),
};
