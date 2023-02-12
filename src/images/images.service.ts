import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Images } from 'src/entity/image.entity';
import { Repository } from 'typeorm';

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
}
