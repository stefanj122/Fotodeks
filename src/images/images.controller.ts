import { Controller, Get, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { Image } from 'src/entity/image.entity';
import { Meta } from 'src/types/meta.type';
import { SortByValidator } from 'src/validators/sort-by.validator';
import { ImagesService } from './images.service';

@ApiTags('public-images')
@Controller('/public/images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'perPage', required: false })
  @ApiQuery({ name: 'sortBy', required: false })
  @Get()
  async searchImages(
    @Query('search') searchQuery: string,
    @Query('page') page: number,
    @Query('perPage') perPage: number,
    @Query('sortBy', SortByValidator) sortBy: [string, 'ASC' | 'DESC'],
  ): Promise<{ images: Image[] & { path: string }[]; meta: Meta }> {
    return await this.imagesService.fetchImages(
      searchQuery,
      page,
      perPage,
      sortBy,
    );
  }
}
