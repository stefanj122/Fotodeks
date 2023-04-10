import { Body, Controller, UseGuards, Request, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/loginUser.dto';
import { UserDto } from './dto/registerUser.dto';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './authentication.service';

@ApiTags('auth')
@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async registerUser(@Body() body: UserDto) {
    return await this.authService.register(body);
  }

  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: LoginDto })
  @Post('/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
}
