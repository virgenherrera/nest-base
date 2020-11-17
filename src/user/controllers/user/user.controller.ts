import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put
} from '@nestjs/common';
import { CreateUserDto, EditUserDto } from '@user/dto';
import { userRoutes } from '@user/user.routes';

@Controller()
export class UserController {
  @Post(userRoutes.users)
  async postUser(@Body() dto: CreateUserDto) {
    return dto;
  }

  @Get(userRoutes.user)
  getUser(@Param('id') id: string) {
    return { id };
  }

  @Get(userRoutes.users)
  getUsers() {
    return { message: 'hello world' };
  }

  @Put(userRoutes.user)
  async putUser(@Param('id') id: string, @Body() dto: EditUserDto) {
    return { id, dto };
  }

  @Delete(userRoutes.user)
  deleteUser(@Param('id') id: string) {
    return { id };
  }
}
