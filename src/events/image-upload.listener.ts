import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Image } from 'src/entity/image.entity';
import { NotificationsService } from 'src/notifications/notifications.service';

@Injectable()
export class ImageUploadListener {
  constructor(private readonly notificationService: NotificationsService) {}
  @OnEvent('image.uploaded')
  handleImageUploadEvent(event: Image) {
    this.notificationService.imageUploaded(event);
  }
}
