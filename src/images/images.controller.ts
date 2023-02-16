import {
  Body,
  Controller,
  Header,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { User } from 'src/decorators/user.decorator';
import { UsersService } from 'src/users/users.service';
import { TagsDto } from './dto/TagsDto.dto';
import { ImagesService } from './images.service';

@ApiTags('Images')
@UseGuards(AuthGuard('jwt'))
@Controller('/images')
export class ImagesController {
  constructor(
    private readonly imagesService: ImagesService,
    private readonly usersService: UsersService,
  ) {}

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        photos: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @Post('/upload')
  @ApiBearerAuth()
  @UseInterceptors(FilesInterceptor('photos'))
  @Header('Content-Type', 'multipart/form-data')
  async uploadPhotos(
    @UploadedFiles() photos: Array<Express.Multer.File>,
    @User() user: any,
  ) {
    const currentUser = await this.usersService.findOneById(user.id);
    return await this.imagesService.uploadPhotos(photos, currentUser);
  }

  @Post('/add/tags')
  @ApiBearerAuth()
  @ApiBody({ isArray: true, type: TagsDto })
  async addTags(@Body() tags: TagsDto[]) {
    return await this.imagesService.addTags(tags);
  }
}
