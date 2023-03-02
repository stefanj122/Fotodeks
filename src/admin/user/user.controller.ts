import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Put,
  Post,
  Delete,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserDto } from 'src/authentification/dto/registerUser.dto';
import { UserService } from './user.service';

@ApiTags('admin-user')
@Controller('/admin/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getListOfUsers() {
    return await this.userService.getListOfUsers();
  }

  @Get('/:id')
  async getSingleUser(@Param('id', ParseIntPipe) userId: number) {
    return await this.userService.getSingleUser(userId);
  }

  @Post()
  async createUser(@Body() userDto: UserDto) {
    return await this.userService.createUser(userDto);
  }

  @Put('/:id')
  async updateUser(
    @Param('id', ParseIntPipe) userId: number,
    @Body() updateUserDto: UserDto,
  ) {
    return await this.userService.updateUser(userId, updateUserDto);
  }

  @Delete('/:id')
  async deleteUser(@Param('id', ParseIntPipe) userId: number) {
    return await this.userService.deleteUser(userId);
  }
}
