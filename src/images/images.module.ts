import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from 'src/entity/comment.entity';
import { Image } from 'src/entity/image.entity';
import { Watermark } from 'src/entity/watermark.entity';
import { ImagesController } from './images.controller';
import { ImagesService } from './images.service';

@Module({
  imports: [TypeOrmModule.forFeature([Image, Watermark, Comment])],
  controllers: [ImagesController],
  providers: [ImagesService],
})
export class ImagesModule {}
