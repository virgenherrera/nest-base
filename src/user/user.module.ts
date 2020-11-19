import { Module } from '@nestjs/common';
import { userControllers } from './controllers';
import { userServices } from './services';

@Module({
  controllers: [...userControllers],
  providers: [...userServices],
})
export class UserModule {}
