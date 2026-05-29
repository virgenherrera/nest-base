import { env } from 'node:process';

// eslint-disable-next-line @typescript-eslint/require-await
export default async function Setup() {
  // set E2E TEST ENV Variables
  Object.assign(env, {
    SERVER_PORT: '0',
    APP_ENV: 'test:e2e',
    SWAGGER_ENABLED: 'false',
  });
}
