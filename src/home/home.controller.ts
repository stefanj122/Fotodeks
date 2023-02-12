import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/decorators/user.decorator';
import { Users } from 'src/entity/user.entity';
import { ImagesService } from 'src/images/images.service';
import { CreateUserDto } from 'src/users/dto/createUserDtio.dto';
import { LoginUserDto } from 'src/users/dto/loginUserDto.dto';
import { HomeService } from './home.service';

@ApiTags('home')
@Controller('/home')
export class HomeController {
  constructor(
    private readonly homeService: HomeService,
    private readonly authService: AuthService,
    private readonly imagesService: ImagesService,
  ) {}

  @Post('/singup')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.homeService.createUser(createUserDto);
  }

  @UseGuards(AuthGuard('local'))
  @ApiBody({ type: LoginUserDto })
  @Post('/login')
  async login(@User() user: Users) {
    return await this.authService.login(user);
  }

  @Get('/images')
  async getImages() {
    return await this.imagesService.getAllImages();
  }
}
