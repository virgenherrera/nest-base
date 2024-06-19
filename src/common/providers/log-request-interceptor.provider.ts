import { Provider } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { LogRequestInterceptor } from '../interceptors';

export const LogRequestInterceptorProvider: Provider = {
  provide: APP_INTERCEPTOR,
  useClass: LogRequestInterceptor,
};
