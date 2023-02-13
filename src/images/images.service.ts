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

  async uploadPhotos(
    photos: Array<Express.Multer.File>,
    user: Users,
    tags: string,
  ) {
    const arrOfPromises = [];

    photos.forEach((photo) => {
      const photoName = uuidv4();
      fs.renameSync(photo.path, process.cwd() + '/photos/' + photoName);
      arrOfPromises.push(
        this.imagesRepository.save({ name: photoName, user: user, tags }),
      );
    });
    Promise.all(arrOfPromises).then((values) => {
      console.log(values);
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
    const file = await new Promise<Buffer>((resolve, reject) => {
      fs.readFile(join(process.cwd(), `/photos/${image.name}`), (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
    const data = await sharp(file)
      .resize(width, height)
      .composite([
        {
          input: join(process.cwd(), '/photos/watermark/' + watermark.name),
          gravity: 'center',
        },
      ])
      .toBuffer();
    return new StreamableFile(data);
  }
}
