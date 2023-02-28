import { Body, Controller, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ImagesService } from './images.service';

@ApiTags('images')
@Controller('/images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post()
  async updateImageApprovalStatus(@Body() imagesData: { id: number; isApproved: boolean }[]) {
    await this.imagesService.updateImageApprovalStatus(imagesData)
    
  }

}
