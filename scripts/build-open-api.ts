import { env } from 'node:process';
import { OpenApiFactory } from '../src/app/factories';

// override Node_Env
Object.assign(env, { NODE_ENV: 'BUILD' });

OpenApiFactory()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);

    process.exit(1);
  });
