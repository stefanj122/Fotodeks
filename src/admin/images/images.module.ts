import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from 'src/entity/image.entity';
import { Watermark } from 'src/entity/watermark.entity';
import { ImagesController } from './images.controller';
import { ImagesService } from './images.service';
import { NotificationsService } from 'src/notifications/notifications.service';
import { User } from 'src/entity/user.entity';
import { Notification } from 'src/entity/notification.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Image, Watermark, User, Notification])],
  controllers: [ImagesController],
  providers: [ImagesService, NotificationsService],
})
export class ImagesModule {}
