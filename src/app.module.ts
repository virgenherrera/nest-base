import { NestFactory } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';

@Module({
  imports: [UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {
  static async bootstrap() {
    const app = await NestFactory.create(AppModule);
    await app.listen(3000);
  }
}
