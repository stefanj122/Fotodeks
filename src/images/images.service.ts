import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { mkdirSync } from 'fs';
import { join } from 'path';
import { Images } from 'src/entity/image.entity';
import { Repository } from 'typeorm';
import * as sharp from 'sharp';
import { Watermark } from 'src/entity/watermark.entity';

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(Images)
    private readonly imagesRepository: Repository<Images>,
    @InjectRepository(Watermark)
    private readonly watermarksRepository: Repository<Watermark>,
  ) {}

  async uploadImages(
    images: Array<Express.Multer.File>,
  ): Promise<{ data: { id: number; name: string; path: string }[] }> {
    const path = join(__dirname, '../../public/images');
    const arrOfPromies: Promise<Images>[] = [];
    const data = [];
    const watermark = await this.watermarksRepository.findOneBy({
      isDefault: true,
    });

    images.forEach((image) => {
      arrOfPromies.push(this.imagesRepository.save({ name: image.filename }));
    });

    const value = await Promise.all(arrOfPromies);
    value.forEach((photo) => {
      const thumbnailPath = join(path, `${photo.id}`, '285x190');
      mkdirSync(thumbnailPath, { recursive: true });
      data.push({
        id: photo.id,
        name: photo.name,
        path: join(thumbnailPath, photo.name),
      });

      sharp(join(__dirname, '../../uploads/images/', photo.name))
        .resize(285, 190)
        .composite([
          {
            input: join(__dirname, '../../uploads/watermarks/', watermark.name),
            gravity: 'center',
          },
        ])
        .toFile(join(thumbnailPath, photo.name));
    });

    return { data };
  }
}
