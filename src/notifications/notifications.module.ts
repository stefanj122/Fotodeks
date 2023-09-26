import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { Notification } from 'src/entity/notification.entity';
import { Image } from 'src/entity/image.entity';
import { Comment } from 'src/entity/comment.entity';
import { ImageUploadListener } from 'src/events/image-upload.listener';
import { ImageApprovalListener } from 'src/events/image-approved.listener';

@Module({
  imports: [TypeOrmModule.forFeature([Notification, Image, Comment, User])],
  controllers: [NotificationsController],
  providers: [NotificationsService, ImageUploadListener, ImageApprovalListener],
})
export class NotificationsModule {}
