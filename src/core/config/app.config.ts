import { Environment } from '@core/enums';
import { APP_CONFIG } from '@core/tokens';
import { registerAs } from '@nestjs/config';

export const appConfig = registerAs(APP_CONFIG, () => {
  const { APP_PORT, APP_USE_DOCS, NODE_ENV } = process.env;
  const config = {
    port: parseInt(APP_PORT, 10),
    useDocs: APP_USE_DOCS === 'true' && NODE_ENV !== Environment.Production,
  };

  Object.seal(config);
  Object.freeze(config);

  return config;
});
