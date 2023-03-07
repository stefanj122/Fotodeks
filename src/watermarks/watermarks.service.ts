import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { join } from 'path';
import { Watermark } from 'src/entity/watermark.entity';
import { DeleteResult, Repository } from 'typeorm';
import { CreateWatermarkDto } from './dto/create-watermark.dto';
import * as fs from 'fs';
import { CreateWatermarkType } from 'src/types/watermarkType';
import { makeUrlPath } from 'src/helpers/makeUrlPath.helper';

@Injectable()
export class WatermarksService {
  constructor(
    @InjectRepository(Watermark)
    private readonly watermarksRepository: Repository<Watermark>,
  ) {}
  async createWatermark(
    dto: CreateWatermarkDto,
    watermark: Express.Multer.File,
  ):Promise<CreateWatermarkType> {
    fs.cpSync(
      watermark.path,
      join(__dirname, '../../public/watermarksStorage/' + watermark.filename),
    );
    const newWatermark = await this.watermarksRepository.save({
      name: watermark.filename,
      description: dto.description,
    });
    const path = makeUrlPath(['watermarksStorage', newWatermark.name]);
    return {
      ...newWatermark,
      path,
    };
  }

  async getSingle(id: number): Promise<CreateWatermarkType> {
    const { name, ...watermark } = await this.watermarksRepository.findOneBy({
      id,
    });
    const path = makeUrlPath(['watermarksStorage', name]);
    return {
      name,
      ...watermark,
      path,
    };
  }

  async updateWatermark(id: number, updateWatermarkDto: CreateWatermarkDto) {
    return await this.watermarksRepository.update(id, updateWatermarkDto);
  }

  async deleteWatermark(id: number): Promise<DeleteResult> {
    const watermark = await this.watermarksRepository.findOneBy({
      id,
    });
    if (watermark && watermark.isDefault === false) {
      return await this.watermarksRepository.delete(id);
    }
    throw new BadRequestException('Watermark cannot be deleted!');
  }
}
