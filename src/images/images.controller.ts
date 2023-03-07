import { Body, Put, Controller, Get, Query  } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { SortByValidator } from 'src/validators/sortBy.validator';
import { ImagesService } from './images.service';

@ApiTags('images')
@Controller('/images')
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
    @Query('sortBy', SortByValidator) sortBy: Record<number, 'ASC' | 'DESC'>,
  ) {
    return await this.imagesService.fetchImages(
      searchQuery,
      page,
      perPage,
      sortBy,
    );
  }
}
