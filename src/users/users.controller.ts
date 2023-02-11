import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/decorators/user.decorator';
import { Users } from 'src/entity/user.entity';
import { CreateUserDto } from './dto/createUserDtio.dto';
import { LoginUserDto } from './dto/loginUserDto.dto';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('/users')
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('/singup')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.userService.createUser(createUserDto);
  }

  @UseGuards(AuthGuard('local'))
  @ApiBody({ type: LoginUserDto })
  @Post('/login')
  async login(@User() user: Users) {
    return await this.authService.login(user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/test')
  async test(@User() user: Users) {
    return user;
  }
}
