import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from 'src/entity/comment.entity';
import { Image } from 'src/entity/image.entity';
import { User } from 'src/entity/user.entity';
import { Watermark } from 'src/entity/watermark.entity';
import { ImagesService } from 'src/images/images.service';
import { WatermarksModule } from 'src/admin/watermarks/watermarks.module';
import { CommentsModule } from './comments/comments.module';
import { ImagesModule } from './images/images.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Image, Watermark, Comment]),
    ImagesModule,
    CommentsModule,
    UsersModule,
    WatermarksModule,
  ],
  providers: [ImagesService],
})
export class AdminModule {}
