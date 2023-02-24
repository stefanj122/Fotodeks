import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { Image } from 'src/entity/image.entity';
import { Repository } from 'typeorm';
import { Watermark } from 'src/entity/watermark.entity';
import { sharpHelper } from 'src/helpers/sharp.helpers';
import { User } from 'src/entity/user.entity';
import { permutationsOfArray } from 'src/helpers/permutateArray.helper';

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

  async searchImages(
    searchQuery: any,
    userId: number | string = '%',
  ): Promise<{ count: number; data: Image[] }> {
    const params = searchQuery.split(' ');
    const arr = permutationsOfArray(params.slice(0, 3));
    const arrOfPromises: Promise<Image[]>[] = [];

    arr.forEach((query) => {
      arrOfPromises.push(
        this.imagesRepository
          .createQueryBuilder('images')
          .select('*')
          .where('tags LIKE :query AND userId LIKE :userId', {
            query,
            userId,
          })
          .andWhere('isApproved = :approved', { approved: true })
          .getRawMany(),
      );
    });
    let result: Image[] = [];
    await Promise.all(arrOfPromises).then((value) => {
      value.forEach((el) => {
        result = result.filter((image) => {
          return !el.some((photo) => {
            return image.id === photo.id;
          });
        });
        result = result.concat(el);
      });
    });

    result = result.sort((a, b) => +b.createdAt - +a.createdAt);
    return { count: result.length, data: result };
  }
}
