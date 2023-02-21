import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { existsSync, mkdirSync } from 'fs';
import { basename, join } from 'path';
import { Images } from 'src/entity/image.entity';
import { Repository } from 'typeorm';
import * as sharp from 'sharp';

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(Images)
    private readonly imagesRepository: Repository<Images>,
  ) {}

  async generateThumbnail(path: string, thumbsize: string): Promise<any> {

    const imageName = basename(path);
    const image = await this.imagesRepository.findOneBy({ name: imageName });
    const thumbnailPath = join(process.cwd(), "public/images", `${image.id}`, thumbsize);

    if(existsSync(thumbnailPath)) {
      return true;
    }
    mkdirSync(thumbnailPath, {recursive: true});

    const WxH = thumbsize.split('x');

    sharp(path).resize(
      Number(WxH[0]), 
      Number(WxH[1]),
    )
    .toFile(join(thumbnailPath, imageName))
  }
}
