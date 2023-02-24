import {
  Controller,
  Get,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiQuery, ApiTags } from '@nestjs/swagger';
import { FileValidator } from 'src/config/fileValidator.config';
import { imagesStorage } from 'src/config/multer.config';
import { GetUser } from 'src/decorator/get-user.decorator';
import { Image } from 'src/entity/image.entity';
import { User } from 'src/entity/user.entity';
import { ImagesService } from './images.service';

@ApiTags('images')
@Controller('/images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        images: {
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
  @UseInterceptors(FilesInterceptor('images', 30, imagesStorage))
  async uploadImages(
    @UploadedFiles(FileValidator)
    images: Express.Multer.File[],
    @GetUser() user: User,
  ): Promise<{ images: { id: number; name: string; path: string }[] }> {
    return await this.imagesService.uploadImages(images, user);
  }

  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'perPage', required: false })
  @Get('/search')
  async searchImages(
    @Query('search') searchQuery: string,
    @Query('page') page: number,
    @Query('perPage') perPage: number,
  ): Promise<{
    count: number;
    page: number;
    perPage: number;
    images: Image[];
  }> {
    return await this.imagesService.searchImages(searchQuery, page, perPage);
  }
}
