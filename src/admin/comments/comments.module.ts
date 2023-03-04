import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from 'src/entity/comment.entity';
import { Image } from 'src/entity/image.entity';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';

@Module({
  imports: [TypeOrmModule.forFeature([Image, Comment])],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
