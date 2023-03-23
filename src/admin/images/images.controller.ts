import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { UserRoleGuard } from 'src/authentication/user-role.guard';
import { imagesStorage } from 'src/config/multer.config';
import { GetUser } from 'src/decorator/get-user.decorator';
import { Roles } from 'src/decorator/role.decorator';
import { Image } from 'src/entity/image.entity';
import { User } from 'src/entity/user.entity';
import { Meta } from 'src/types/meta.type';
import { FileValidator } from 'src/validators/file.validator';
import { ImagesService } from './images.service';

@ApiTags('admin-images')
@ApiBearerAuth()
@UseGuards(UserRoleGuard)
@Controller('/admin/images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @ApiBody({
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: { id: { type: 'number' }, tags: { type: 'string' } },
      },
    },
  })
  @Put('/tags')
  async updateImagesTags(
    @Body() imagesDataTags: { id: number; tags: string }[],
  ): Promise<string> {
    return await this.imagesService.updateImagesTags(imagesDataTags);
  }

  @ApiBody({
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: { id: { type: 'number' }, isApproved: { type: 'boolean' } },
      },
    },
  })
  @Roles('admin')
  @Put('/approval')
  async updateImageApprovalStatus(
    @Body() imagesData: { id: number; isApproved: boolean }[],
  ): Promise<string> {
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
    @Query('isApproved') isApproved: boolean,
    @Query('sortBy') sortBy: string,
  ): Promise<{ images: Image[] & { path: string }[]; meta: Meta }> {
    return await this.imagesService.fetchImages(
      searchQuery,
      page,
      perPage,
      +userId,
      isApproved,
      sortBy,
    );
  }
}
