import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationsService } from 'src/notifications/notifications.service';
import { Image } from '../entity/image.entity';

@Injectable()
export class ImageApprovalListener {
  constructor(private readonly notificationService: NotificationsService) {}
  @OnEvent('images.approved')
  async handleImageApprovalStatus(approvedImages: Image[]) {
    this.notificationService.imageApproved(approvedImages);
  }
}
