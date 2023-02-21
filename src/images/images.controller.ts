import {
  Controller,
  FileTypeValidator,
  ParseFilePipe,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { imagesStorage } from 'src/config/multer.config';
import { ImagesService } from './images.service';

@ApiTags('images')
@Controller('/images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post('upload')
  @UseInterceptors(FilesInterceptor('images', 30, imagesStorage))
  async uploadImages(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({
            fileType: /png|jpeg|jpg/g,
          }),
        ],
      }),
    )
    images: Array<Express.Multer.File>,
  ): Promise<{ data: { id: number; name: string; path: string }[] }> {
    return await this.imagesService.uploadImages(images);
  }
}
