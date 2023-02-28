import { Body, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Images } from 'src/entity/image.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(Images)
    private readonly imagesRepository: Repository<Images>,
  ) {}
  async updateImageApprovalStatus(@Body() imagesData: { id: number; isApproved: boolean }[]){
    const arrOfPromises = []
    imagesData.forEach(element=>{
      arrOfPromises.push(this.imagesRepository.update( element.id, {isApproved: element.isApproved}))
      })
    await Promise.all(arrOfPromises)
    return "images updated"

  }
}
      
 
    

                   



    
