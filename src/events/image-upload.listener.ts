import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Image } from 'src/entity/image.entity';
import { NotificationsService } from 'src/notifications/notifications.service';
import { User } from '../entity/user.entity';

@Injectable()
export class ImageUploadListener {
  constructor(private readonly notificationService: NotificationsService) {}
  @OnEvent('images.uploaded')
  handleImageUploadEvent(uploadData: { data: Image[]; user: User }) {
    this.notificationService.imageUploaded(uploadData);
  }
}
