import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto, UpdateUserDto } from '../dto';
import { UserService } from '../services';
import { userRoutes } from '../user.routes';

@ApiTags('Users')
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post(userRoutes.users)
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  @Get(userRoutes.user)
  findAll() {
    return this.userService.findAll();
  }

  @Get(userRoutes.users)
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Put(userRoutes.user)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(userRoutes.user)
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
