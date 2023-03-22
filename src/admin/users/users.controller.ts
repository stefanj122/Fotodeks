import { GetUser } from 'src/decorator/get-user.decorator';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Put,
  Post,
  Delete,
  ForbiddenException,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { UserRoleGuard } from 'src/authentication/user-role.guard';
import { CreateUserDto } from './dto/create-user.dto';

@ApiTags('admin-user')
@Controller('/admin/user')
export class UserController {
  constructor(private readonly userService: UsersService) {}

  @ApiBearerAuth()
  @UseGuards(UserRoleGuard)
  @Get('/me')
  async getCurrentUser(@GetUser() user) {
    if (user) {
      delete user.password;
      return user;
    }
    throw new ForbiddenException();
  }

  @Get()
  async getListOfUsers() {
    return await this.userService.getListOfUsers();
  }

  @Get('/:id')
  async getSingleUser(@Param('id', ParseIntPipe) userId: number) {
    return await this.userService.getSingleUser(userId);
  }

  @Post()
  async createUser(@Body() userDto: CreateUserDto) {
    return await this.userService.createUser(userDto);
  }

  @Put('/:id')
  async updateUser(
    @Param('id', ParseIntPipe) userId: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.userService.updateUser(userId, updateUserDto);
  }

  @Delete('/:id')
  @HttpCode(204)
  async deleteUser(@Param('id', ParseIntPipe) userId: number): Promise<void> {
    return await this.userService.deleteUser(userId);
  }
}
