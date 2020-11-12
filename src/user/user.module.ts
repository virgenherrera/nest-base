import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { userControllers } from './controllers';

@Module({
  controllers: [...userControllers],
  imports: [TypeOrmModule.forFeature([User])],
})
export class UserModule {}
