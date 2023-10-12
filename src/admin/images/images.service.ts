import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Meta } from 'src/types/meta.type';
import { sortByHelper } from 'src/helpers/sort-by.helper';
import { imageSizeValidator } from 'src/validators/imageSizes.validator';

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(Image)
    private imagesRepository: Repository<Image>,
    @InjectRepository(Watermark)
    private watermarksRepository: Repository<Watermark>,

    private em: EventEmitter2,
  ) {}

  async updateImagesTags(
    imagesDataTags: { id: number; tags: string }[],
  ): Promise<string> {
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
  // async updateImageApprovalStatus(
  //   imagesData: { id: number; isApproved: boolean }[],
  // ): Promise<string> {
  //   const arrOfPromises = [];
  //
  //   for (const element of imagesData) {
  //     const image = await this.imagesRepository.findOneBy({ id: element.id });
  //     if (!image) {
  //       throw new BadRequestException();
  //     }
  //
  //     if (image.isApproved === true) {
  //       arrOfPromises.push(
  //         this.imagesRepository.update(element.id, {
  //           isApproved: false,
  //         }),
  //       );
  //       // return `Image with ID: ${element.id} is disapproved!`;
  //     } else {
  //       arrOfPromises.push(
  //         this.imagesRepository.update(element.id, {
  //           isApproved: element.isApproved,
  //         }),
  //       );
  //       try {
  //         await Promise.all(arrOfPromises);
  //         this.em.emit('image.approved', imagesData);
  //         return `Image with ID: ${element.id} is approved successfully!`;
  //       } catch (error) {
  //         throw new BadRequestException(error.message);
  //       }
  //     }
  //   }
  // }

  async updateImageApprovalStatus(imageIds: number[]): Promise<string> {
    const approvedImages: Image[] = [];
    const disapprovedImages: Image[] = [];


    const images = await this.imagesRepository
      .createQueryBuilder('image')
      .leftJoinAndSelect('image.user', 'user')
      .where('image.id IN (:...imageIds)', { imageIds })
      .getMany();

    for (const image of images) {
      if (image.isApproved === true) {
        disapprovedImages.push(image);
        image.isApproved = false;
      } else {
        approvedImages.push(image);
        image.isApproved = true;
      }
    }

    try {
      await this.imagesRepository.save([
        ...approvedImages,
        ...disapprovedImages,
      ]);
      if (approvedImages.length > 0) {
        this.em.emit('images.approved', approvedImages);
      }
      return 'success';
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async uploadImages(
    imagesUploaded: Array<Express.Multer.File>,
    user: User,
  ): Promise<{
    imagesUploaded: { id: number; name: string; path: string }[];
    imagesFailed: { name: string; message: string }[];
  }> {
    const uploadedPhotos = [];
    const failedPhotos = [];
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

    for (const image of imagesUploaded) {
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

        uploadedPhotos.push({
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
        failedPhotos.push({
          name: image.originalname,
          message: `${image.originalname} can not be uploaded!`,
        });
        fs.rmSync(image.path);
      }
    }
    if (uploadedPhotos.length > 0) {
      this.em.emit('images.uploaded', { uploadedPhotos, user });
    }
    return { imagesUploaded: uploadedPhotos, imagesFailed: failedPhotos };
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
    imageId: number,
    imageSize: string,
    user: User,
    watermarkId?: number | undefined,
  ) {
    imageSizeValidator(imageSize);

    const watermark =
      user.role === 'admin' && watermarkId
        ? await this.watermarksRepository.findOneBy({ id: watermarkId })
        : await this.watermarksRepository.findOneBy({ isDefault: true });

    if (!watermark) {
      throw new NotFoundException('Watermark not found!');
    }
    const watermarkPath = join(
      __dirname,
      '../../../uploads/watermarks/',
      watermark.name,
    );
    const image = await this.imagesRepository.findOneBy({
      id: imageId,
      isApproved: true,
    });
    if (!image) {
      throw new NotFoundException('Image not found!');
    }
    const imagePath = join(__dirname, '../../../uploads/images/', image.name);
    const thumbnailPath = join(
      __dirname,
      '../../../public/images',
      `${watermark.id}`,
      imageSize,
    );
    if (!existsSync(thumbnailPath)) {
      mkdirSync(thumbnailPath, { recursive: true });
    }
    if (
      await sharpHelper(
        imagePath,
        watermarkPath,
        join(thumbnailPath, image.name),
        imageSize,
      )
    ) {
      return {
        path: makeUrlPath(['images', `${watermark.id}`, imageSize, image.name]),
      };
    }
  }
}
