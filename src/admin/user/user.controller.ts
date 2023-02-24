import { Controller, Get, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/decorator/get-user.decorator';
import { Image } from 'src/entity/image.entity';
import { User } from 'src/entity/user.entity';
import { ImagesService } from 'src/images/images.service';
import { UserService } from './user.service';

@ApiTags('user')
@Controller('/user')
export class UserController {
  constructor(
    private readonly usersService: UserService,
    private readonly imagesService: ImagesService,
  ) {}

  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'perPage', required: false })
  @Get('/search')
  async searchUserImages(
    @Query('search') searchQuery: string,
    @GetUser() user: User,
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
      user.id,
    );
  }
}
