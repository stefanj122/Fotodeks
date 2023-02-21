import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { existsSync, mkdirSync } from 'fs';
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
    const arrOfPromies: Promise<Images>[] = [];
    const data = [];
    const watermark = await this.watermarksRepository.findOneBy({
      isDefault: true,
    });
    const thumbnailPath = join(
      __dirname,
      '../../public/images',
      `${watermark.id}`,
      process.env.BASE_THUMBNAIL_SIZE,
    );
    if (!existsSync(thumbnailPath)) {
      mkdirSync(thumbnailPath, { recursive: true });
    }

    images.forEach((image) => {
      arrOfPromies.push(this.imagesRepository.save({ name: image.filename }));
    });

    const savedImages = await Promise.all(arrOfPromies);
    savedImages.forEach((photo) => {
      data.push({
        id: photo.id,
        name: photo.name,
        path: join(thumbnailPath, photo.name),
      });
      const [width, height] = process.env.BASE_THUMBNAIL_SIZE.split('x');
      sharp(join(process.env.IMAGE_PATH, photo.name))
        .resize(+width, +height)
        .composite([
          {
            input: join(process.env.WATERMARK_PATH, watermark.name),
            gravity: 'center',
          },
        ])
        .toFile(join(thumbnailPath, photo.name));
    });

    return { data };
  }
}
