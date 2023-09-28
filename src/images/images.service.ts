import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Image } from 'src/entity/image.entity';
import { Repository } from 'typeorm';
import { Watermark } from 'src/entity/watermark.entity';
import { paginate } from 'src/helpers/paginate.helper';
import { makeUrlPath } from 'src/helpers/make-url-path.helper';
import { permutateSearch } from 'src/helpers/brackets.helper';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { sharpHelper } from 'src/helpers/sharp.helper';
import { Meta } from 'src/types/meta.type';
import { sortByHelper } from 'src/helpers/sort-by.helper';
import { Comment } from 'src/entity/comment.entity';

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(Image)
    private readonly imagesRepository: Repository<Image>,
    @InjectRepository(Watermark)
    private readonly watermarksRepository: Repository<Watermark>,
    @InjectRepository(Comment)
    private readonly commentsRepository: Repository<Comment>,
  ) {}

  async fetchImages(
    searchQuery?: string,
    page?: number,
    perPage?: number,
    sortBy?: string,
  ): Promise<{ images: Array<Image & { path: string }>; meta: Meta }> {
    const images: Array<Image & { path: string }> = [];
    const imageColumns = this.imagesRepository.metadata.columns.map(
      (column) => column.propertyName,
    );
    const [column, order] = sortByHelper(sortBy, imageColumns);

    const { currentPage, offset, limit } = paginate(page, perPage);
    const watermark = await this.watermarksRepository.findOneBy({
      isDefault: true,
    });
    const watermarkPath = join(
      __dirname,
      '../../uploads/watermarks/',
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

    const [data, count] = await this.imagesRepository
      .createQueryBuilder('images')
      .leftJoinAndSelect('images.user', 'user')
      .where('images.isApproved = :isApproved', { isApproved: true })
      .andWhere(permutateSearch(searchQuery))
      .orderBy(`images.${column}`, `${order}`)
      .offset(offset)
      .limit(limit)
      .getManyAndCount();

    data.forEach(async (image) => {
      delete image.user.password;

      if (!existsSync(join(thumbnailPath, image.name))) {
        const imagePath = join(__dirname, '../../uploads/images/', image.name);
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

  async findOne(
    id: number,
    page?: number,
    perPage?: number,
  ): Promise<{
    image: Image & { path: string };
    comments: Comment[];
    meta: Meta;
  }> {
    const image = await this.imagesRepository.findOneBy({ id });
    if (!image) {
      throw new NotFoundException('image not found');
    }
    const watermark = await this.watermarksRepository.findOneBy({
      isDefault: true,
    });
    const thumbnailPath = join(
      __dirname,
      '../../public/images',
      `${watermark.id}`,
      '800x600',
    );
    if (!existsSync(thumbnailPath)) {
      mkdirSync(thumbnailPath, { recursive: true });
    }
    const watermarkPath = join(
      __dirname,
      '../../uploads/watermarks/',
      watermark.name,
    );
    if (!existsSync(join(thumbnailPath, image.name))) {
      const imagePath = join(__dirname, '../../uploads/images/', image.name);
      sharpHelper(
        imagePath,
        watermarkPath,
        join(thumbnailPath, image.name),
        '800x600',
      );
    }
    const path = makeUrlPath([
      'images',
      `${watermark.id}`,
      '800x600',
      image.name,
    ]);
    const { currentPage, offset, limit } = paginate(page, perPage);
    const [comments, count] = await this.commentsRepository
      .createQueryBuilder('image')
      .where({
        image: id,
        isApproved: true,
      })
      .take(limit)
      .skip(offset)
      .getManyAndCount();

    return {
      image: { path, ...image },
      comments,
      meta: {
        count,
        currentPage,
        perPage: limit,
        sortBy: null,
      },
    };
  }
}
