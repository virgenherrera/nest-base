import { env } from 'node:process';

// eslint-disable-next-line @typescript-eslint/require-await
export default async function Setup() {
  Object.assign(env, {
    SERVER_PORT: '0',
    APP_ENV: 'test',
    SWAGGER_ENABLED: 'false',
  });
}
