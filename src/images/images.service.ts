import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Images } from 'src/entity/image.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(Images)
    private readonly imagesRepository: Repository<Images>,
  ) {}
    async updateImagesTags(imagesDataTags: { id: number; tags: string} []){
    const arrOfPromises = []
    imagesDataTags.forEach((element) => {
      arrOfPromises.push(this.imagesRepository.update(
        element.id, {
          tags: element.tags
        })
      );
    })
    try { await Promise.all(arrOfPromises)
      return 'success'}
      catch(error){throw new BadRequestException()}
   }
  }
