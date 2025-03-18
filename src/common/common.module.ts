import { Global, Logger, Module, Provider } from '@nestjs/common';

@Global()
@Module({
  providers: CommonModule.providers,
  exports: CommonModule.providers,
})
export class CommonModule {
  static providers: Provider[] = [Logger];
}
