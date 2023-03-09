import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { Image } from 'src/entity/image.entity';
import { User } from 'src/entity/user.entity';
import { Watermark } from 'src/entity/watermark.entity';
import {
  filerByUserAndIsApprved,
  permutateSearch,
} from 'src/helpers/brackets.helper';
import { makeUrlPath } from 'src/helpers/makeUrlPath.helper';
import { paginate } from 'src/helpers/paginate.helper';
import { sharpHelper } from 'src/helpers/sharp.helpers';
import { Repository } from 'typeorm';
import * as fs from 'fs';

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(Image)
    private imagesRepository: Repository<Image>,
    @InjectRepository(Watermark)
    private watermarksRepository: Repository<Watermark>,
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
      throw new BadRequestException();
    }
  }

  async uploadImages(
    images: Array<Express.Multer.File>,
    user: User,
  ): Promise<{ images: { id: number; name: string; path: string }[] }> {
    const data = [];
    const watermark = await this.watermarksRepository.findOneBy({
      isDefault: true,
    });
    const thumbnailPath = join(
      __dirname,
      '../../../public/images',
      `${watermark.id}`,
      process.env.BASE_THUMBNAIL_SIZE,
    );

    const watermarkPath = join(
      __dirname,
      '../../../uploads/watermarks/',
      watermark.name,
    );
    if (!existsSync(thumbnailPath)) {
      mkdirSync(thumbnailPath, { recursive: true });
    }

    for (const image of images) {
      const imagePath = join(
        __dirname,
        '../../../uploads/images/',
        image.filename,
      );
      if (
        await sharpHelper(
          imagePath,
          watermarkPath,
          join(thumbnailPath, image.filename),
        )
      ) {
        const photo = await this.imagesRepository.save({
          name: image.filename,
          user,
        });
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
      } else {
        data.push({
          name: image.originalname,
          message: `${image.originalname} can not be uploaded!`,
        });
        fs.rmSync(image.path);
      }
    }
    return { images: data };
  }

  async fetchImages(
    searchQuery?: string,
    page?: number,
    perPage?: number,
    userId?: number,
    isApproved?: number,
    sortBy?: Record<number, 'ASC' | 'DESC'>,
  ) {
    const images: Array<Image & { path: string }> = [];
    const { currentPage, offset, limit } = paginate(page, perPage);
    const watermark = await this.watermarksRepository.findOneBy({
      isDefault: true,
    });
    const watermarkPath = join(
      __dirname,
      '../../../uploads/watermarks/',
      watermark.name,
    );
    const query = this.imagesRepository
      .createQueryBuilder('images')
      .leftJoinAndSelect('images.user', 'user')
      .where(filerByUserAndIsApprved(userId, isApproved))
      .andWhere(permutateSearch(searchQuery))
      .orderBy(`images.${sortBy[0]}`, `${sortBy[1]}`);

    const [data, count] = await query
      .offset(offset)
      .limit(limit)
      .getManyAndCount();

    data.forEach(async (image) => {
      if (image.user) {
        delete image.user.password;
      }
      const thumbnailPath = join(
        __dirname,
        '../../../public/images',
        `${watermark.id}`,
        process.env.BASE_THUMBNAIL_SIZE,
      );
      if (!existsSync(join(thumbnailPath, image.name))) {
        mkdirSync(thumbnailPath, { recursive: true });
        const imagePath = join(
          __dirname,
          '../../../uploads/images/',
          image.name,
        );
        sharpHelper(imagePath, watermarkPath, join(thumbnailPath, image.name));
      }
      images.push({
        ...image,
        path: makeUrlPath([
          'images',
          `${watermark.id}`,
          process.env.BASE_THUMBNAIL_SIZE,
          image.name,
        ]),
      });
    });

    return {
      images,
      meta: {
        count,
        currentPage,
        perPage: limit,
        sortBy: [sortBy[0], sortBy[1]],
      },
    };
  }
}
