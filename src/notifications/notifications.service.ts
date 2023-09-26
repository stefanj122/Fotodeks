import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
      } catch (err) {
        logger.log(err);
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

  async isSeen(id: number) {
    try {
      const notification = await this.notificationRepository.findOneBy({ id });
      if (!notification) {
        throw new NotFoundException('Notification not found!');
      }
      await this.notificationRepository.update(id, { isSeen: true });

      return { status: 'success' };
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
