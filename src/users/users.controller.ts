import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from 'src/auth/auth.service';
import { CreateUserDto } from './dto/createUserDtio.dto';
import { UsersService } from './users.service';

@Controller('/users')
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.userService.createUser(createUserDto);
  }

  @UseGuards(AuthGuard('local'))
  @Post('/login')
  async login(@Req() req: any) {
    return await this.authService.login(req.user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/test')
  async test(@Req() req: any) {
    return req.user;
  }
}
