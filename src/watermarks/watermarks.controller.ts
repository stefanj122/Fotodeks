import {
  Body,
  Controller,
  Param,
  Get,
  ParseIntPipe,
  Post,
  UploadedFile,
  UseInterceptors,
  Patch,
  Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileValidator } from 'src/validators/file.validator';
import { watermarksStorage } from 'src/config/multer.config';
import { DeleteResult } from 'typeorm';
import { CreateWatermarkDto } from './dto/create-watermark.dto';
import { WatermarksService } from './watermarks.service';
import { CreateWatermarkType } from 'src/types/watermarkType';

@ApiTags('Watermarks')
@Controller('/watermarks')
export class WatermarksController {
  constructor(private readonly watermarksService: WatermarksService) {}
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        watermark: {
          type: 'string',
          format: 'binary',
        },
        description: {
          type: 'string',
        },
      },
    },
  })
  @Post()
  @UseInterceptors(FileInterceptor('watermark', watermarksStorage))
  async createWatermark(
    @Body() createWatermarkDto: CreateWatermarkDto,
    @UploadedFile(FileValidator)
    image: Express.Multer.File,
  ): Promise<CreateWatermarkDto> {
    return await this.watermarksService.createWatermark(
      createWatermarkDto,
      image,
    );
  }

  @Get('/:id')
  async getSingle(@Param('id', ParseIntPipe) id: number) {
    return await this.watermarksService.getSingle(id);
  }

  @Patch('/:id')
  async updateWatermark(
    @Body() updateWatermarkDto: CreateWatermarkDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return await this.watermarksService.updateWatermark(id, updateWatermarkDto);
  }

  @Delete('/:id')
  async deleteWatermark(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<DeleteResult> {
    return await this.watermarksService.deleteWatermark(id);
  }
}
