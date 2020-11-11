import { Module } from '@nestjs/common';
import { userControllers } from './controllers';

@Module({
  controllers: [...userControllers],
})
export class UserModule {}
