import { env } from 'node:process';

export default function Setup() {
  // set E2E TEST ENV Variables
  Object.assign(env, {
    NODE_ENV: 'E2E',
    APP_PORT: '0',

    APP_UPLOADS_PATH: 'e2e_Downloads',
  });
}
