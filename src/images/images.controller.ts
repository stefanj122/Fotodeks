import {
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from 'src/decorators/user.decorator';
import { UsersService } from 'src/users/users.service';
import { ImagesService } from './images.service';

@ApiTags('Images')
@UseGuards(AuthGuard('jwt'))
@Controller('/images')
export class ImagesController {
  constructor(
    private readonly imagesService: ImagesService,
    private readonly usersService: UsersService,
  ) {}

  @Post('/upload')
  @ApiBearerAuth()
  @UseInterceptors(FilesInterceptor('photos'))
  async uploadPhotos(
    @UploadedFiles() photos: Array<Express.Multer.File>,
    @User() user: any,
    @Body('tags') tags: string,
  ) {
    const currentUser = await this.usersService.findOneById(user.id);
    return await this.imagesService.uploadPhotos(photos, currentUser, tags);
  }
}
