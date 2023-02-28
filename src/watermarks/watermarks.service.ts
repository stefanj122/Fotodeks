import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { join } from 'path';
import { Watermark } from 'src/entity/watermark.entity';
import { DeleteResult, Repository } from 'typeorm';
import { CreateWatermarkDto } from './dto/create-watermark.dto';
import { UpdateWatermarkDto } from './dto/update-watermark.dto';
import * as fs from 'fs';

@Injectable()
export class WatermarksService {
  constructor(
    @InjectRepository(Watermark)
    private readonly watermarksRepository: Repository<Watermark>,
  ) {}
  async create(dto: CreateWatermarkDto, watermark: Express.Multer.File) {
    fs.cpSync(
      watermark.path,
      join(__dirname, '../../public/watermarks/' + watermark.filename),
    );
    return await this.watermarksRepository.save({
      name: watermark.filename,
      description: dto.description,
    });
  }

  async get(id: number) {
    const { name, ...watermark } = await this.watermarksRepository.findOneBy({
      id,
    });
    const path = process.env.BASE_URL + '/watermarks/' + name;
    return {
      ...watermark,
      path,
    };
  }

  async update(id: number, updateWatermarkDto: UpdateWatermarkDto) {
    return await this.watermarksRepository.update(id, updateWatermarkDto);
  }

  async delete(id: number): Promise<DeleteResult> {
    const watermark = await this.watermarksRepository.findOneBy({
      id,
    });
    if (watermark && watermark.isDefault === false) {
      return await this.watermarksRepository.delete(id);
    }
  }
}
