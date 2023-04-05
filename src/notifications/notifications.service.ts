import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { info } from 'console';
import { Comment } from 'src/entity/comment.entity';
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
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>, // @InjectRepository(Image) // private readonly imageRepository: Repository<Image>,
  ) {}

  async imageUploaded(image: Image) {
    {
      try {
        await this.notificationRepository.save({
          type: 'image',
          user: image.user,
          message: '',
          // meta: 'imageId : ${image.Id}',
          // meta:{"imageId":"${image.Id}"},
          // meta: {"imageId"},
          // meta: {
          //           "image":
          // {"Imageid" : "image.Id"}
          // },
          // meta: {
          // // "image":
          // [{"Imageid" : "${image.Id}"}]
          // },
          // meta:[{"imageId" : "${image.Id}"}],
        });
      } catch (err) {
        logger.log;
      };

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
