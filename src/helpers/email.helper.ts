import * as nodemailer from 'nodemailer';
import { logger } from '../helpers/logger';

export const sendImageEmailNotification = (
  emails: string[],
  displayName: string,
  imageId: number,
) => {
  const getTrans = () => {
    return nodemailer.createTransport({
      host: process.env.MAILER_HOST,
      port: 587,
      secure: false,
      auth: {
        user: process.env.USER_NAME,
        pass: process.env.USER_PASSWORD,
      },
    });
  };

  const transporter = getTrans();
  const notification = {
    from: process.env.APP_NO_REPLY_EMAIL,
    to: emails,
    subject: 'You have a new images to approve!',
    html: `<h1>User ${displayName} uploaded some goodies on our platform.</h1>
        <p>Please review them <a href="${process.env.BASE_URL}${process.env.USER_UPLOAD_IMAGES}${imageId}">here</a></p>`,
  };

  transporter.sendMail(notification, function (err, info) {
    if (err) {
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
  });
};
