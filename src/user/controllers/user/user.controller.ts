import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateUserDto, EditUserDto } from '@user/dto';
import { userPath } from '@user/user.route-path';

@Controller()
export class UserController {
  @Post(userPath.users)
  async postUser(@Body() dto: CreateUserDto) {
    return dto;
  }

  @Get(userPath.user)
  getUser(@Param('id') id: string) {
    return { id };
  }

  @Get(userPath.users)
  getUsers() {
    return { message: 'hello world' };
  }

  @Put(userPath.user)
  async putUser(@Param('id') id: string, @Body() dto: EditUserDto) {
    return { id, dto };
  }

  @Delete(userPath.user)
  deleteUser(@Param('id') id: string) {
    return { id };
  }
}
