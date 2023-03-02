import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Put,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileValidator } from 'src/config/fileValidator.config';
import { imagesStorage } from 'src/config/multer.config';
import { GetUser } from 'src/decorator/get-user.decorator';
import { User } from 'src/entity/user.entity';
import { ImagesService } from './images.service';

@ApiTags('images')
@Controller('/images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Put('images/Approval')
  async updateImageApprovalStatus(
    @Body() imagesData: { id: number; isApproved: boolean }[],
  ) {
    return await this.imagesService.updateImageApprovalStatus(imagesData);
  }

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
  @Post('upload')
  @UseInterceptors(FilesInterceptor('images', 30, imagesStorage))
  async uploadImages(
    @UploadedFiles(FileValidator)
    images: Express.Multer.File[],
    @GetUser() user: User,
  ): Promise<{ data: { id: number; name: string; path: string }[] }> {
    return await this.imagesService.uploadImages(images, user);
  }
}
