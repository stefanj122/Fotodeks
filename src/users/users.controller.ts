import {
  Controller,
  Get,
  Header,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from 'src/decorators/user.decorator';
import { Users } from 'src/entity/user.entity';
import { ImagesService } from 'src/images/images.service';
import { UsersService } from './users.service';

@ApiTags('users')
@UseGuards(AuthGuard('jwt'))
@Controller('/users')
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private readonly imagesService: ImagesService,
  ) {}

  @Get('/test')
  @ApiBearerAuth()
  async test(@User() user: Users) {
    console.log(process.cwd());
    return user;
  }

  @Get('/download/image/:id')
  @ApiBearerAuth()
  @Header('Content-Type', 'image/png')
  async downloadImage(@Param('id', ParseIntPipe) imageId: number) {
    return await this.imagesService.downloadImage(imageId);
  }
}
