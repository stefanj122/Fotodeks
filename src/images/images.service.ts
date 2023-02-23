import {
  BadRequestException,
  Injectable,
  StreamableFile,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Images } from 'src/entity/image.entity';
import { Users } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import { join } from 'path';
import * as sharp from 'sharp';
import { Watermark } from 'src/entity/watermark.entity';
import { TagsDto } from './dto/TagsDto.dto';

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(Images)
    private readonly imagesRepository: Repository<Images>,
    @InjectRepository(Watermark)
    private readonly watermarkRepository: Repository<Watermark>,
  ) {}

  async getAllImages() {
    return await this.imagesRepository.find({
      where: { isApproved: true },
      relations: ['watermark'],
    });
  }

  async noApprovedImages() {
    return await this.imagesRepository.find({ where: { isApproved: false } });
  }

  async uploadPhotos(photos: Array<Express.Multer.File>, user: Users) {
    const arrOfPromises = [];

    photos.forEach((photo) => {
      const photoName = uuidv4();
      fs.renameSync(photo.path, process.cwd() + '/photos/' + photoName);
      arrOfPromises.push(
        this.imagesRepository.save({ name: photoName, user: user }),
      );
    });
    Promise.all(arrOfPromises).then((values) => {
      console.log(values);
    });
  }

  async addTags(tags: TagsDto[]) {
    const arrOfPromises: Promise<Images>[] = [];
    tags.forEach((tag) => {
      arrOfPromises.push(
        this.imagesRepository.save({ id: tag.id, tags: tag.tags }),
      );
    });
    Promise.all(arrOfPromises).then(() => {
      console.log('Tags updated');
    });
  }

  async downloadImage(id: number, width: number, height: number) {
    const image = await this.imagesRepository.findOneBy({ id });
    if (!image) {
      throw new BadRequestException('Image not found');
    }
    const watermark = await this.watermarkRepository.findOneBy({
      isDefafult: true,
    });
    // const file = await new Promise<Buffer>((resolve, reject) => {
    //   fs.readFile(join(process.cwd(), `/photos/${image.name}`), (err, data) => {
    //     if (err) {
    //       reject(err);
    //     } else {
    //       resolve(data);
    //     }
    //   });
    // });
    const png = await sharp(
      join(process.cwd(), '/photos/watermark/' + watermark.name),
    )
      .resize(height - 100)
      .png()
      .toBuffer();
    const data = await sharp(join(process.cwd(), `/photos/${image.name}`))
      .resize(width, height)
      .composite([
        {
          input: png,
          gravity: 'center',
        },
      ])
      .toBuffer();
    return new StreamableFile(data);
  }
  async searchImages(
    searchQeury: string,
    userId: number | string = '%',
    data: Image[] = [],
    i = 12,
  ): Promise<{ count: number; data: Image[] }> {
    const params = searchQeury.split(' ');
    let result = data;

    if (params.length > 3) {
      return { count: 0, data: [] };
    } else if (params.length === 1) {
      params[1] = '';
      params[2] = '';
    } else if (params.length === 2) {
      params[2] = '';
    }
    const [x, y, z] = i.toString().padStart(3, '0').split('');

    if (
      params[x] &&
      (params[y] || params[y] === '') &&
      (params[z] || params[z] === '') &&
      x !== y &&
      y !== z &&
      x !== z
    ) {
      result = await this.imagesRepository
        .createQueryBuilder('images')
        .select('*')
        .where('tags LIKE :query AND userId LIKE :userId', {
          query: `%${params[+x]}%${params[+y]}%${params[+z]}%`,
          userId,
        })
        .andWhere('isApproved = :approved', { approved: true })
        .getRawMany();
      if (result.length !== 0) {
        result = result.filter((ael) => {
          return !data.some((bel) => {
            return ael.id === bel.id;
          });
        });
        result = result.concat(data);
      } else {
        result = data;
      }
    }
    if (i < 1000) {
      i++;
      return await this.searchImages(searchQeury, userId, result, i);
    } else {
      result = result.sort((a, b) => +b.createdAt - +a.createdAt);
      return { count: data.length, data: result };
    }
  }
}
