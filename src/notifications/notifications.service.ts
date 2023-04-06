import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { info } from 'console';
import { Image } from 'src/entity/image.entity';
import { Notification } from 'src/entity/notification.entity';
import { User } from 'src/entity/user.entity';
import { sendImageEmailNotification } from 'src/helpers/email.helper';
import { logger } from 'src/helpers/logger';
import { Repository } from 'typeorm';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  async imageUploaded(image: Image) {
    {
      try {
        await this.notificationRepository.save({
          type: 'image',
          user: image.user,
          message: '',
          meta: JSON.stringify({ imageId: image.id }),
        });
      } catch (err)
      { 
        logger.log(
          'err',
          'Error while sending notification for uploaded image to admins',
        );
      }
      if (info) {
        logger.log(
          'info',
          'Notification for uploaded image has been sent to admins',
        );
      }

      const emails = await this.usersRepository
        .createQueryBuilder('user')
        .select('user.email')
        .where('user.role = :role', { role: 'admin' })
        .getRawMany();

      sendImageEmailNotification(
        emails.map((userEmail) => userEmail.user_email),
        image.user.displayName,
        image.id,
      );
    }
  }
}
