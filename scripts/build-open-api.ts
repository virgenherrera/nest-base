import { env } from 'node:process';
import { OpenApiBuilder } from '../src/app/builders';

// override Node_Env
Object.assign(env, { NODE_ENV: 'BUILD' });

OpenApiBuilder()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);

    process.exit(1);
  });
