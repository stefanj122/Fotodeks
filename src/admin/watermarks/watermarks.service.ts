import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { join } from 'path';
import { Watermark } from 'src/entity/watermark.entity';
import { Repository } from 'typeorm';
import { CreateWatermarkDto } from './dto/create-watermark.dto';
import * as fs from 'fs';
import { CreateWatermarkType } from 'src/types/watermark.type';
import { makeUrlPath } from 'src/helpers/make-url-path.helper';

@Injectable()
export class WatermarksService {
  constructor(
    @InjectRepository(Watermark)
    private readonly watermarksRepository: Repository<Watermark>,
  ) {}
  async createWatermark(
    dto: CreateWatermarkDto,
    watermark: Express.Multer.File,
  ): Promise<CreateWatermarkType> {
    if (fs.existsSync(watermark.path)) {
      fs.cpSync(
        watermark.path,
        join(__dirname, '../../public/watermarksStorage/' + watermark.filename),
      );
    } else {
      throw new NotFoundException('Watermark does not exist');
    }
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
    try {
      const { name, ...watermark } = await this.watermarksRepository.findOneBy({
        id,
      });
      const path = makeUrlPath(['watermarksStorage', name]);
      return {
        name,
        ...watermark,
        path,
      };
    } catch (err) {
      throw new NotFoundException('Watermark does not exist');
    }
  }

  async updateWatermark(
    id: number,
    updateWatermarkDto: CreateWatermarkDto,
  ): Promise<CreateWatermarkType> {
    const watermark = await this.watermarksRepository.findOneBy({ id });
    if (!watermark) {
      throw new NotFoundException('Watermark not found!');
    }
    watermark.description = updateWatermarkDto.description;
    await this.watermarksRepository.save(watermark);
    const path = makeUrlPath(['watermarksStorage', watermark.name]);
    return {
      ...watermark,
      path,
    };
  }

  async deleteWatermark(id: number) {
    const watermark = await this.watermarksRepository.findOneBy({
      id,
    });
    if (watermark && watermark.isDefault === false) {
      await this.watermarksRepository.delete(id);
      return;
    }
    throw new BadRequestException('Watermark cannot be deleted!');
  }
}
