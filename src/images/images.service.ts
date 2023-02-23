import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { existsSync, mkdirSync } from 'fs';
import { join, basename } from 'path';
import { Image } from 'src/entity/image.entity';
import { Repository } from 'typeorm';
import { Watermark } from 'src/entity/watermark.entity';
import { sharpHelper } from 'src/helpers/sharp.helpers';
import { User } from 'src/entity/user.entity';
import * as sharp from 'sharp';

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(Image)
    private readonly imagesRepository: Repository<Image>,
    @InjectRepository(Watermark)
    private readonly watermarksRepository: Repository<Watermark>,
  ) {}

  async uploadImages(
    images: Array<Express.Multer.File>,
    user: User,
  ): Promise<{ data: { id: number; name: string; path: string }[] }> {
    const arrOfPromies: Promise<Image>[] = [];
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

    const watermarkPath = join(
      __dirname,
      '../../uploads/watermarks/',
      watermark.name,
    );
    if (!existsSync(thumbnailPath)) {
      mkdirSync(thumbnailPath, { recursive: true });
    }

    images.forEach((image) => {
      arrOfPromies.push(
        this.imagesRepository.save({ name: image.filename, user }),
      );
    });

    const savedImages = await Promise.all(arrOfPromies);
    savedImages.forEach((photo) => {
      data.push({
        id: photo.id,
        name: photo.name,
        path: join(
          process.env.BASE_URL,
          'public/images',
          `${watermark.id}`,
          process.env.BASE_THUMBNAIL_SIZE,
          photo.name,
        ),
      });

      const imagePath = join(__dirname, '../../uploads/images/', photo.name);
      sharpHelper(imagePath, watermarkPath).toFile(
        join(thumbnailPath, photo.name),
      );
    });

    return { data };
  }

  async generateThumbnail(path: string, thumbsize: string): Promise<string> {
    const imageName = basename(path);
    const image = await this.imagesRepository.findOneBy({ name: imageName });
    const thumbnailPath = join(
      process.cwd(),
      'public/images',
      `${image.id}`,
      thumbsize,
    );

    if (existsSync(thumbnailPath)) {
      return thumbnailPath;
    }
    mkdirSync(thumbnailPath, { recursive: true });

    const WxH = thumbsize.split('x');

    sharp(path)
      .resize(Number(WxH[0]), Number(WxH[1]))
      .toFile(join(thumbnailPath, imageName))
      .then(() => true)
      .catch(() => false);
    return thumbnailPath;
  }
}
