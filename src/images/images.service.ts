import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { Image } from 'src/entity/image.entity';
import { Like, Repository } from 'typeorm';
import { Watermark } from 'src/entity/watermark.entity';
import { sharpHelper } from 'src/helpers/sharp.helpers';
import { User } from 'src/entity/user.entity';
import { permutationsOfArray } from 'src/helpers/permutateArray.helper';
import { paginate } from 'src/helpers/paginate.helper';
import { makeUrlPath } from 'src/helpers/makeUrlPath.helper';

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
  ): Promise<{ images: { id: number; name: string; path: string }[] }> {
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
        path: makeUrlPath([
          'images',
          `${watermark.id}`,
          process.env.BASE_THUMBNAIL_SIZE,
          photo.name,
        ]),
      });

      const imagePath = join(__dirname, '../../uploads/images/', photo.name);
      sharpHelper(imagePath, watermarkPath).toFile(
        join(thumbnailPath, photo.name),
      );
    });

    return { images: data };
  }

  async searchImages(
    searchQuery = '',
    page = 1,
    perPage: number,
    userId?: number | string,
  ): Promise<{
    count: number;
    page: number;
    perPage: number;
    images: Image[];
  }> {
    const params = searchQuery.split(' ');
    const arr = permutationsOfArray(params.slice(0, 3));
    const arrOfPromises: Promise<Image[]>[] = [];
    const { limit, offset } = paginate(page, perPage);
    const watermark = await this.watermarksRepository.findOneBy({
      isDefault: true,
    });

    arr.forEach((query) => {
      arrOfPromises.push(
        this.imagesRepository.find({
          select: {
            id: true,
            name: true,
            tags: true,
            createdAt: true,
            updatedAt: true,
            user: { id: true, displayName: true },
          },
          where: {
            tags: Like(query),
            user: Like(userId ? userId : '%'),
            isApproved: true,
          },
          relations: ['user'],
        }),
      );
    });

    let result = [];
    await Promise.all(arrOfPromises).then((permutedOutput) => {
      permutedOutput.forEach((arrOfImages) => {
        result = result.filter((image) => {
          return !arrOfImages.some((photo) => {
            return image.id === photo.id;
          });
        });
        result = result.concat(arrOfImages);
      });
    });

    result.forEach((image) => {
      image.path = makeUrlPath([
        'images',
        watermark.id,
        process.env.BASE_THUMBNAIL_SIZE,
        image.name,
      ]);
    });

    const count = result.length;
    result = result
      .sort((a, b) => +b.createdAt - +a.createdAt)
      .slice(offset, limit + offset);

    return { count, page: +page, perPage: limit, images: result };
  }
}
