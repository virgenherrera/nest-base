import { env } from 'node:process';

import { OpenApiFactory } from '../src/app/factories';

Object.assign(env, { APP_ENV: 'BUILD-API-DOCS', APP_LOG_LEVELS: '' });

OpenApiFactory()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);

    process.exit(1);
  });
