import { PagingDto } from '@core/dto/incoming-paging.dto';
import { Numerable } from '@core/dto/numerable.dto';
import { Paging } from '@core/dto/paging.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
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
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get(userRoutes.users)
  async findAll(@Query() query: PagingDto) {
    console.dir(query);
    const paging = new Paging(query);
    const data = await this.userService.findAll();

    return new Numerable(data, paging);
  }

  @Get(userRoutes.user)
  findOne(@Param('id') id: string) {
    return this.userService.getById(id);
  }

  @Put(userRoutes.user)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(userRoutes.user)
  remove(@Param('id') id: string) {
    return this.userService.delete(id);
  }
}
