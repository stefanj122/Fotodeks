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
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
import { UserRoleGuard } from 'src/authentication/user-role.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from 'src/entity/user.entity';
import { Meta } from 'src/types/meta.type';

@ApiTags('admin-user')
@Controller('/admin/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

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

  @ApiQuery({ name: 'page', required: false})
  @ApiQuery({ name: 'perPage', required: false})
  @ApiQuery({ name: 'sortBy', required: false})
  @Get()
  async getListOfUsers(
    @Query('page') page: number,
    @Query('perPage') perPage: number,
    @Query('sortBy') sortBy: string,
  ): Promise<{ users: User[]; meta: Meta }> {
    return await this.userService.getListOfUsers(page, perPage, sortBy);
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
