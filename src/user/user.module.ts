import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { userControllers } from './controllers';
import { User } from './entities/user.entity';
import { userServices } from './services';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [...userControllers],
  providers: [...userServices],
  exports: [...userServices],
})
export class UserModule {}
