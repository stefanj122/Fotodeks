import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from 'src/entity/comment.entity';
import { Image } from 'src/entity/image.entity';
import { User } from 'src/entity/user.entity';
import { Watermark } from 'src/entity/watermark.entity';
import { ImagesService } from 'src/images/images.service';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { CommentsModule } from './comments/comments.module';
import { ImagesModule } from './images/images.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Image, Watermark, Comment]),
    ImagesModule,
    CommentsModule,
  ],
  controllers: [AdminController],
  providers: [AdminService, ImagesService],
})
export class AdminModule {}
