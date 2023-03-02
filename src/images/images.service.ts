import {
  BadGatewayException,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { Image } from 'src/entity/image.entity';
import { Repository } from 'typeorm';
import { Watermark } from 'src/entity/watermark.entity';
import { sharpHelper } from 'src/helpers/sharp.helpers';
import { User } from 'src/entity/user.entity';

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(Image)
    private readonly imagesRepository: Repository<Image>,
    @InjectRepository(Watermark)
    private readonly watermarksRepository: Repository<Watermark>,
  ) {}

  async updateImageApprovalStatus(
    imagesData: { id: number; isApproved: boolean }[],
  ) {
    const arrOfPromises = [];
    imagesData.forEach((element) => {
      arrOfPromises.push(
        this.imagesRepository.update(element.id, {
          isApproved: element.isApproved,
        }),
      );
    });
    try {
      await Promise.all(arrOfPromises);
      return 'success';
    } catch (error) {
      return BadRequestException;
    }
  }

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
          'images',
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
}
