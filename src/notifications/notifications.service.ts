import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from 'src/entity/comment.entity';
import { Image } from 'src/entity/image.entity';
import { Notification } from 'src/entity/notification.entity';
import { User } from 'src/entity/user.entity';
import { sendImageEmailNotification } from 'src/helpers/email.helper';
import { Repository } from 'typeorm';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async imageUploaded(image: Image) {
    try {
      await this.notificationRepository.save({
        type: 'image',
        user: image.user,
        message: '',
        meta: `Imageid: ${image.id} `,
      });
    } catch (e) {
      throw new BadRequestException('Notification cannot be created');
    }
    const adminEmails = await this.usersRepository.find({
      where: { role: 'admin' },
      select: { email: true },
    });
    const emails: string[] = adminEmails.map((user) => user.email);
    console.log(emails);
    sendImageEmailNotification(emails, image.user.displayName, image.id);
  }
}
