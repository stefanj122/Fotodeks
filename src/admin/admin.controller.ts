import { Controller, Get, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { Image } from 'src/entity/image.entity';
import { ImagesService } from 'src/images/images.service';
import { AdminService } from './admin.service';

@ApiTags('admin')
@Controller('/admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly imagesService: ImagesService,
  ) {}

  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'userId', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'perPage', required: false })
  @Get('/search')
  async searchUserImages(
    @Query('search') searchQuery: string,
    @Query('userId') userId: number,
    @Query('page') page: number,
    @Query('perPage') perPage: number,
  ): Promise<{
    count: number;
    page: number;
    perPage: number;
    images: Image[];
  }> {
    return await this.imagesService.searchImages(
      searchQuery,
      page,
      perPage,
      userId,
    );
  }
}
