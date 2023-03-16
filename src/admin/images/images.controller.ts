import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiQuery, ApiTags } from '@nestjs/swagger';
import { imagesStorage } from 'src/config/multer.config';
import { GetUser } from 'src/decorator/get-user.decorator';
import { User } from 'src/entity/user.entity';
import { FileValidator } from 'src/validators/file.validator';
import { SortByValidator } from 'src/validators/sortBy.validator';
import { ImagesService } from './images.service';

@ApiTags('admin-images')
@Controller('/admin/images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Put('/tags')
  async updateImagesTags(
    @Body() imagesDataTags: { id: number; tags: string }[],
  ) {
    return await this.imagesService.updateImagesTags(imagesDataTags);
  }

  @Put('images/approval')
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
  @ApiQuery({ name: 'userId', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'perPage', required: false })
  @ApiQuery({ name: 'isApproved', required: false })
  @ApiQuery({ name: 'sortBy', required: false })
  @Get()
  async searchUserImages(
    @Query('search') searchQuery: string,
    @Query('userId') userId: number,
    @Query('page') page: number,
    @Query('perPage') perPage: number,
    @Query('isApproved') isApproved: number,
    @Query('sortBy', SortByValidator) sortBy: Record<string, 'ASC' | 'DESC'>,
  ) {
    return await this.imagesService.fetchImages(
      searchQuery,
      page,
      perPage,
      userId,
      isApproved,
      sortBy,
    );
  }
}
