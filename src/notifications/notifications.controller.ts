import { Controller, Param, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';

@ApiTags('notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly noticationsService: NotificationsService) {}

  @Patch('/isSeen/:id')
  async isSeen(@Param('id') notificationId: number) {
    return await this.noticationsService.isSeen(+notificationId);
  }
}
