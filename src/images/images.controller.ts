import { Body, Controller, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ImagesService } from './images.service';

@ApiTags('images')
@Controller('/images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}
  @Put()
  async updateImagesTags(@Body() imagesDataTags: {id: number; tags: string}[]){
    return await this.imagesService.updateImagesTags(imagesDataTags)
  }

}
