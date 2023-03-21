import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { Image } from 'src/entity/image.entity';
import { User } from 'src/entity/user.entity';
import { Watermark } from 'src/entity/watermark.entity';
import {
  filterByUserAndIsApproved,
  permutateSearch,
} from 'src/helpers/brackets.helper';
import { makeUrlPath } from 'src/helpers/make-url-path.helper';
import { paginate } from 'src/helpers/paginate.helper';
import { sharpHelper } from 'src/helpers/sharp.helper';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import { Meta } from 'src/types/meta.type';
import { sortByHelper } from 'src/helpers/sort-by.helper';

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(Image)
    private imagesRepository: Repository<Image>,
    @InjectRepository(Watermark)
    private watermarksRepository: Repository<Watermark>,
  ) {}

  async updateImagesTags(imagesDataTags: { id: number; tags: string }[]) {
    const arrOfPromises = [];
    imagesDataTags.forEach((element) => {
      arrOfPromises.push(
        this.imagesRepository.update(element.id, {
          tags: element.tags,
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
    isApproved?: boolean,
    sortBy?: string,
  ): Promise<{ images: Array<Image & { path: string }>; meta: Meta }> {
    const images: Array<Image & { path: string }> = [];
    const { currentPage, offset, limit } = paginate(page, perPage);
    const imageColumns = this.imagesRepository.metadata.columns.map(
      (column) => column.propertyName,
    );
    const [column, order] = sortByHelper(sortBy, imageColumns);

    const watermark = await this.watermarksRepository.findOneBy({
      isDefault: true,
    });
    const watermarkPath = join(
      __dirname,
      '../../../uploads/watermarks/',
      watermark.name,
    );

    const thumbnailPath = join(
      __dirname,
      '../../public/images',
      `${watermark.id}`,
      process.env.BASE_THUMBNAIL_SIZE,
    );
    if (!existsSync(thumbnailPath)) {
      mkdirSync(thumbnailPath, { recursive: true });
    }

    const query = this.imagesRepository
      .createQueryBuilder('images')
      .leftJoinAndSelect('images.user', 'user')
      .where(filterByUserAndIsApproved(userId, isApproved))
      .andWhere(permutateSearch(searchQuery))
      .orderBy(`images.${column}`, `${order}`);

    const [data, count] = await query
      .offset(offset)
      .limit(limit)
      .getManyAndCount();

    data.forEach(async (image) => {
      if (image.user) {
        delete image.user.password;
      }

      if (!existsSync(join(thumbnailPath, image.name))) {
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
        sortBy: [column, order],
      },
    };
  }
  async downloadImage(
    imageID: number,
    imageSize: string,
    user: User,
    watermarkId?: number | undefined,
  ) {
    const sizeOfImages = ['800x600', '1280x720', '1920x1080'];
    if (!sizeOfImages.includes(imageSize)) {
      throw new BadRequestException('Image size is not supported!');
    }

    //  if (user.role === 'admin') {
    //     const watermark = await this.watermarksRepository.findOneBy({ id : watermarkId });
    //  }else{
    //   const watermark = await this.watermarksRepository.findOneBy({ isDefault: true });
    // }
    const watermark = await this.watermarksRepository.findOne({
      where:
        user.role === 'admin' && watermarkId
          ? { id: watermarkId }
          : { isDefault: true },
    });
    // const watermarkQwery = await this.watermarksRepository.createQueryBuilder('watermark')

    // if(user.role === 'admin' && watermarkId){
    //   const watermark1 = watermarkQwery.where('id = :watermarkId',{ watermarkId}).getOne();
    // } else {
    //   const watermark1 = watermarkQwery.where('isDefault = :isDefault', { isDefault: true }).getOne();
    // }

    const watermarkPath = join(
      __dirname,
      '../../../uploads/watermarks/',
      watermark.name,
    );
    const image = await this.imagesRepository.findOneBy({
      id: imageID,
      isApproved: true,
    });
    const imagePath = join(__dirname, '../../../uploads/images/', image.name);
    const thumbnailPath = join(
      __dirname,
      '../../public/images',
      `${watermark.id}`,
      process.env.BASE_THUMBNAIL_SIZE,
    );
    if (!existsSync(thumbnailPath)) {
      mkdirSync(thumbnailPath, { recursive: true });
    }
    if (await sharpHelper(imagePath, watermarkPath, thumbnailPath, imageSize)) {
      return {
        path: makeUrlPath(['images', `${watermark.id}`, imageSize, image.name]),
      };
    }
  }
}
