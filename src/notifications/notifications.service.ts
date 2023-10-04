import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Image } from 'src/entity/image.entity';
import { Notification } from 'src/entity/notification.entity';
import { User } from 'src/entity/user.entity';
import { sendMail } from 'src/helpers/email-sender.helper';
import { Repository } from 'typeorm';
import { MailerService } from '@nestjs-modules/mailer';
import { emailLogger } from 'src/helpers/logger.helper';
import { MailDataT } from 'src/types/mail-data.type';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    private readonly mailerService: MailerService,
    @InjectRepository(Image)
    private readonly imagesRepository: Repository<Image>,
  ) {}

  async imageUploaded(images: Image[]) {
    try {
      await this.notificationRepository.save({
        type: 'image',
        user: images[0].user,
        message: 'Image uploaded successfully!',
        meta: JSON.stringify({ imageIds: images.map((image) => image.id) }),
      });
    } catch (err) {
      emailLogger.log({
        level: 'error',
        message: JSON.stringify(err),
      });
    }
    const adminEmails = await this.usersRepository
      .createQueryBuilder('user')
      .select('user.email')
      .where('user.role = :role', { role: 'admin' })
      .getRawMany();

    const imagesData = images.map((image) => ({
      displayName: image.user.displayName,
      imageId: image.id,
      link: `https://fotodesk.app/admin/images/pending-images/${image.id}`,
    }));

    adminEmails.map(async (userEmail) => {
      const mailData: MailDataT = {
        email: userEmail.user_email,
        subject: 'Images Uploaded',
        template: 'image-uploaded',
        context: imagesData,
        mailerService: this.mailerService,
      };

      try {
        if (await sendMail(mailData)) {
          return { email: userEmail.user_email, status: 'Email sent.' };
        } else {
          return { email: userEmail.user_email, status: 'Email not sent!' };
        }
      } catch (error) {
        return {
          email: userEmail.user_email,
          status: 'Email error: ' + error.message,
        };
      }
    });
  }

  async imageApproved(imagesData: { id: number; isApproved: boolean }[]) {
    for (const image of imagesData) {
      try {
        const imageDb = await this.imagesRepository
          .createQueryBuilder('images')
          .leftJoinAndSelect('images.user', 'user')
          .where('images.id = :id', { id: image.id })
          .getOne();

        await this.notificationRepository.save({
          type: 'image',
          user: imageDb.user,
          message: '',
          meta: JSON.stringify({ imageId: image.id }),
        });

        const mailData: MailDataT = {
          email: [imageDb.user.email],
          subject: 'Image Approved',
          template: 'image-approved',
          context: [
            {
              displayName: imageDb.user.displayName,
              imageId: imageDb.id,
            },
          ],
          mailerService: this.mailerService,
        };

        if (await sendMail(mailData)) {
          return { status: 'Email sent.' };
        } else {
          return { status: 'Email not sent!' };
        }
      } catch (err) {
        emailLogger.log({
          level: 'error',
          message: JSON.stringify(err.message),
        });
      }
    }
  }
}
