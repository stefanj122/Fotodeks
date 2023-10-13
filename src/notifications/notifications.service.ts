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
  ) {
  }

  async imageUploaded(uploadData: { uploadedPhotos: Image[]; user: User }) {
    try {
      await this.notificationRepository.save({
        type: 'image',
        user: uploadData.user,
        message: 'Image uploaded successfully!',
        meta: JSON.stringify({
          imageIds: uploadData.uploadedPhotos.map((image) => image.id),
        }),
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
      .getMany();

    const imagesData = [];

    for (const image of uploadData.uploadedPhotos) {
      imagesData.push({
        displayName: uploadData.user.displayName,
        imageId: image.id,
        link: `https://fotodesk.app/admin/images/pending-images/${image.id}`,
      });
    }
    adminEmails.map(async (userEmail) => {
      const mailData: MailDataT = {
        email: userEmail.email,
        subject: 'Images Uploaded',
        template: 'image-uploaded',
        context: { context: imagesData },
        mailerService: this.mailerService,
      };

      try {
        if (await sendMail(mailData)) {
          return { email: userEmail.email, status: 'Email sent.' };
        } else {
          return { email: userEmail.email, status: 'Email not sent!' };
        }
      } catch (error) {
        return {
          email: userEmail.email,
          status: 'Email error: ' + error.message,
        };
      }
    });
  }

  async imageApproved(approvedImages: Image[]) {
    const emailsAndImageUrls = new Map();

    for (const image of approvedImages) {
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

      const imageUrl = `https://fotodesk.app/images/${image.id}`;

      if (!emailsAndImageUrls.has(imageDb.user.email)) {
        emailsAndImageUrls.set(imageDb.user.email, []);
      }
      emailsAndImageUrls.get(imageDb.user.email).push(imageUrl);
    }
    if (emailsAndImageUrls.size === 0) {
      return { status: 'No images to process.' };
    }

    const results = [];

    for (const [email, imageUrls] of emailsAndImageUrls) {
      const mailData = {
        email,
        subject: 'Images Approved',
        template: 'image-approved',
        context: { context: imageUrls },
        mailerService: this.mailerService,
      };

      try {
        if (await sendMail(mailData)) {
          results.push({ status: 'Email sent.' });
        } else {
          results.push({ status: 'Email not sent!' });
        }
      } catch (err) {
        emailLogger.log({
          level: 'error',
          message: JSON.stringify(err),
        });
      }
    }

    return results;
  }
}
