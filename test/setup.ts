import { env } from 'node:process';

export default async function Setup() {
  // set E2E TEST ENV Variables
  Object.assign(env, {
    NODE_ENV: 'E2E',
    APP_PORT: '0',
  });
}
