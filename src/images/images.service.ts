import { Injectable, StreamableFile } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Images } from 'src/entity/image.entity';
import { Users } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import { join } from 'path';

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(Images)
    private readonly imagesRepository: Repository<Images>,
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

  async downloadImage(id: number) {
    const image = await this.imagesRepository.findOneBy({ id });
    const file = fs.createReadStream(
      join(process.cwd(), `/photos/${image.name}`),
    );
    return new StreamableFile(file);
  }
}
