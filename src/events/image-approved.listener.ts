import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationsService } from 'src/notifications/notifications.service';

@Injectable()
export class ImageApprovalListener {
  constructor(private readonly notificationService: NotificationsService) {}
  @OnEvent('image.approved')
  async handleImageApprovalStatus(
    imagesData: { id: number; isApproved: boolean }[],
  ) {
    this.notificationService.imageApproved(imagesData);
  }
}
